export class Pause implements IPause {
  private __pause__: Promise<void>;

  static for(delay: number): IPause {
    return new this(delay);
  }

  constructor(delay: number) {
    this.__pause__ = new Promise<void>(resolve => {
      setTimeout(resolve, delay);
    });
  }

  resume(onResume): IPause {
    this.__pause__.then(onResume);
    return this;
  }

  catch(handler): void {
    this.__pause__.catch(handler);
  }
}
