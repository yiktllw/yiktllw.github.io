interface IVector {
  x: number;
  y: number;
  transpose(): IVector;
  multiply(vector: IVector): number;
}

interface Vector2_Brand {
  _vectorBrand: never;
}
interface Vector2_Dual_Brand {
  _vectorDualBrand: never;
}

interface IMatrix {
  v1: Vector2;
  v2: Vector2;
  v1_horizontal: Vector2_Dual;
  v2_horizontal: Vector2_Dual;

  transpose(): IMatrix;

  add(matrix: IMatrix): IMatrix;
  subtract(matrix: IMatrix): IMatrix;

  determinant(): number;
  inverse(): IMatrix;

  mul(matrix: IMatrix): IMatrix;
  add(matrix: IMatrix): IMatrix;
  subtract(matrix: IMatrix): IMatrix;

  apply(vector: IVector): IVector;

  scale(scalar: number): IMatrix;
  into_scaled(scalar: number): IMatrix;
}

export class Vector2 implements IVector {
  // @ts-ignore
  private _brand!: Vector2_Brand;
  public x: number;
  public y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  public transpose() {
    return new Vector2_Dual(this.x, this.y);
  }
  multiply(vector: Vector2_Dual): number {
    return this.x * vector.x + this.y * vector.y;
  }
}

export class Vector2_Dual implements IVector {
  // @ts-ignore
  private _brand!: Vector2_Dual_Brand;
  public x: number;
  public y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  public transpose() {
    return new Vector2(this.x, this.y);
  }
  multiply(vector: Vector2): number {
    return this.x * vector.x + this.y * vector.y;
  }
}

export class Matrix2 implements IMatrix {
  public v1: Vector2;
  public v2: Vector2;
  get v1_horizontal(): Vector2_Dual {
    return new Vector2_Dual(this.v1.x, this.v2.x);
  }
  get v2_horizontal(): Vector2_Dual {
    return new Vector2_Dual(this.v1.y, this.v2.y);
  }
  constructor(v1: Vector2, v2: Vector2);
  constructor(x1: number, x2: number, y1: number, y2: number);
  constructor(
    arg1: Vector2 | number,
    arg2: Vector2 | number,
    arg3?: number,
    arg4?: number,
  ) {
    if (arg1 instanceof Vector2 && arg2 instanceof Vector2) {
      this.v1 = arg1;
      this.v2 = arg2;
    } else if (
      typeof arg1 === "number" &&
      typeof arg2 === "number" &&
      typeof arg3 === "number" &&
      typeof arg4 === "number"
    ) {
      this.v1 = new Vector2(arg1, arg3);
      this.v2 = new Vector2(arg2, arg4);
    } else {
      throw new Error("Invalid arguments");
    }
  }
  public transpose(): IMatrix {
    return new Matrix2(this.v1.x, this.v1.y, this.v2.x, this.v2.y);
  }
  public add(matrix: Matrix2): IMatrix {
    return new Matrix2(
      this.v1.x + matrix.v1.x,
      this.v2.x + matrix.v2.x,
      this.v1.y + matrix.v1.y,
      this.v2.y + matrix.v2.y,
    );
  }
  public subtract(matrix: Matrix2): IMatrix {
    return new Matrix2(
      this.v1.x - matrix.v1.x,
      this.v2.x - matrix.v2.x,
      this.v1.y - matrix.v1.y,
      this.v2.y - matrix.v2.y,
    );
  }
  public determinant(): number {
    return this.v1.x * this.v2.y - this.v1.y * this.v2.x;
  }
  public inverse(): Matrix2 {
    const det = this.determinant();
    if (det === 0) {
      throw new Error("Matrix is not invertible");
    }
    return new Matrix2(
      this.v2.y / det,
      -this.v2.x / det,
      -this.v1.y / det,
      this.v1.x / det,
    );
  }
  public mul(matrix: Matrix2): Matrix2 {
    return new Matrix2(
      this.v1_horizontal.multiply(matrix.v1),
      this.v1_horizontal.multiply(matrix.v2),
      this.v2_horizontal.multiply(matrix.v1),
      this.v2_horizontal.multiply(matrix.v2),
    );
  }
  public apply(vector: Vector2): Vector2_Dual;
  public apply(vector: Vector2_Dual): Vector2;
  public apply(vector: Vector2 | Vector2_Dual): Vector2 | Vector2_Dual {
    if (vector instanceof Vector2) {
      return new Vector2(
        vector.multiply(this.v1_horizontal),
        vector.multiply(this.v2_horizontal),
      );
    } else if (vector instanceof Vector2_Dual) {
      return new Vector2_Dual(
        vector.multiply(this.v1),
        vector.multiply(this.v2),
      );
    }
    throw new Error("Invalid vector type");
  }
  scale(scalar: number): Matrix2 {
    return new Matrix2(
      this.v1.x * scalar,
      this.v2.x * scalar,
      this.v1.y * scalar,
      this.v2.y * scalar,
    );
  }
  into_scaled(scalar: number): Matrix2 {
    this.v1.x *= scalar;
    this.v2.x *= scalar;
    this.v1.y *= scalar;
    this.v2.y *= scalar;
    return this;
  }
}
