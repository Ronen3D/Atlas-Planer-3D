import * as THREE from 'three';

export interface ItemProps {
    id?: string;
    name?: string;
    object?: THREE.Object3D;
    metadata?: Record<string, any>;
}

export class Item {
    id: string;
    libraryId?: string;
    name: string;
    object?: THREE.Object3D;
    metadata: Record<string, any>;

    constructor(props: ItemProps = {}, pObject: THREE.Object3D) {
        this.libraryId = props.id
        this.id = Item.generateId();
        this.name = props.name ?? 'Item';
        this.object = pObject;
        this.object.name = this.name + '_' + this.id;
        this.object.userData['itemId'] = this.id;
        this.metadata = props.metadata ?? {};
    }
    //_______________________________________________________

    public setPosition(x: number, y: number, z: number): this {
        if (this.object) {
            this.object.position.x = x;
            this.object.position.y = y;
            this.object.position.z = z;
        }
        return this;
    }
    //_______________________________________________________

    public setRotation(x: number, y: number, z: number): this {
        if (this.object) {
            this.object.rotation.x = x;
            this.object.rotation.y = y;
            this.object.rotation.z = z;
        }
        return this;
    }
    //_______________________________________________________

    public setScale(x: number, y: number, z: number): this {
        if (this.object) {
            this.object.scale.x = x;
            this.object.scale.y = y;
            this.object.scale.z = z;
        }
        return this;
    }
    //_______________________________________________________

    public toggleVisibility(): this {
        if (this.object) {
            this.object.visible = !this.object.visible;
        }
        return this;
    }
    //_______________________________________________________

    public clone(overrides: Partial<ItemProps> = {}): Item {
        let pObject: THREE.Object3D | undefined = this.object ? this.object.clone(true) : undefined;
        return new Item({
            id: overrides.id ?? Item.generateId(),
            name: overrides.name ?? this.name,
            metadata: { ...(this.metadata ?? {}), ...(overrides.metadata ?? {})},
        }, pObject!);
    }
    //_______________________________________________________

    public toJSON(): Record<string, any> {
        return {
            id: this.id,
            name: this.name,
            position: { ...this.object?.position ?? {} },
            rotation: { ...this.object?.rotation ?? {} },
            scale: { ...this.object?.scale ?? {} },
            visible: this.object?.visible ?? false,
            metadata: { ...this.metadata },
        };
    }
    //_______________________________________________________

    static generateId(): string {
        let idTime = Date.now().toString(36);
        idTime = idTime.substring(idTime.length - 4);
        let idRandom = Math.floor(Math.random() * 1e9).toString(36);
        return `i-${idTime}-${idRandom}`;
    }
}