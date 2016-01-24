export class ChPause implements IChPause {
  private pause: Promise<void>;

  static for(delay: number): IChPause {
    return new this(delay);
  }

  constructor(delay: number) {
    this.pause = new Promise<void>(resolve => {
      setTimeout(resolve, delay);
    });
  }

  resume(onResume): IChPause {
    this.pause.then(onResume);
    return this;
  }

  catch(handler): void {
    this.pause.catch(handler);
  }
}
