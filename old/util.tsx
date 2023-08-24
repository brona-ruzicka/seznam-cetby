type Nullable<T> = T | null;

type Supplier<T> = () => T;
type Consumer<T> = (t: T) => void;

export type { Nullable, Supplier, Consumer } 