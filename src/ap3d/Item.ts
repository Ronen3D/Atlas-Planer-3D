export interface ItemProps {
    id?: string;
    name?: string;
    position?: { x: number; y: number; z: number };
    rotation?: { x: number; y: number; z: number };
    scale?: { x: number; y: number; z: number };
    visible?: boolean;
    metadata?: Record<string, any>;
}



export class Item {
    id: string;
    name: string;
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    scale: { x: number; y: number; z: number };
    visible: boolean;
    metadata: Record<string, any>;

    constructor(props: ItemProps = {}) {
        this.id = props.id ?? Item.generateId();
        this.name = props.name ?? 'Item';
        this.position = props.position ?? { x: 0, y: 0, z: 0 };
        this.rotation = props.rotation ?? { x: 0, y: 0, z: 0 };
        this.scale = props.scale ?? { x: 1, y: 1, z: 1 };
        this.visible = props.visible ?? true;
        this.metadata = props.metadata ?? {};
    }
    //_______________________________________________________

    public setPosition(x: number, y: number, z: number): this {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
        return this;
    }
    //_______________________________________________________

    public setRotation(x: number, y: number, z: number): this {
        this.rotation.x = x;
        this.rotation.y = y;
        this.rotation.z = z;
        return this;
    }
    //_______________________________________________________

    public setScale(x: number, y: number, z: number): this {
        this.scale.x = x;
        this.scale.y = y;
        this.scale.z = z;
        return this;
    }
    //_______________________________________________________

    public toggleVisibility(): this {
        this.visible = !this.visible;
        return this;
    }
    //_______________________________________________________

    public clone(overrides: Partial<ItemProps> = {}): Item {
        return new Item({
            id: overrides.id ?? Item.generateId(),
            name: overrides.name ?? this.name,
            position: overrides.position ?? { ...this.position },
            rotation: overrides.rotation ?? { ...this.rotation },
            scale: overrides.scale ?? { ...this.scale },
            visible: overrides.visible ?? this.visible,
            metadata: { ...(this.metadata ?? {}), ...(overrides.metadata ?? {}) },
        });
    }
    //_______________________________________________________

    public toJSON(): Record<string, any> {
        return {
            id: this.id,
            name: this.name,
            position: { ...this.position },
            rotation: { ...this.rotation },
            scale: { ...this.scale },
            visible: this.visible,
            metadata: { ...this.metadata },
        };
    }
    //_______________________________________________________

    static fromJSON(obj: any): Item {
        return new Item({
            id: obj.id,
            name: obj.name,
            position: obj.position,
            rotation: obj.rotation,
            scale: obj.scale,
            visible: obj.visible,
            metadata: obj.metadata,
        });
    }
    //_______________________________________________________

    static generateId(): string {
        return `item_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e6).toString(36)}`;
    }
}