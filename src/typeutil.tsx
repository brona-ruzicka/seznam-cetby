type Nullable<T> = T | null;

type Full<T> = T extends object ? { [P in keyof T]: T[P] } : T;
type DeepFull<T> = T extends object ? { [P in keyof T]: DeepFull<T[P]> } : T;

type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

type Mutable<T> = T extends ReadonlyArray<infer I> ? Array<I> : T extends object ? { -readonly [P in keyof T ]: T[P] } : T;
type DeepMutable<T> = T extends ReadonlyArray<infer I> ? Array<DeepMutable<I>> : T extends object ? { -readonly [P in keyof T ]: DeepMutable<T[P]> } : T;

type Supplier<T> = () => T;
type Consumer<T> = (t: T) => void;

type ItemOrArray<T> = T | Array<T>
type ItemOrReadonlyArray<T> = T | ReadonlyArray<T>;

type ReadonlyRecord<K extends string | number | symbol, V> =  Readonly<Record<K, V>>


export type {
    Nullable,
    Full,
    DeepFull,
    DeepPartial,
    Mutable,
    DeepMutable,
    Supplier,
    Consumer,
    ItemOrArray,
    ItemOrReadonlyArray,
    ReadonlyRecord,
};