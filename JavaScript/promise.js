class Scheduler {
    constructor(maxSize) {
      this.maxSize = maxSize;
      this.currentSize = 0;
      this.queue = [];
    }
    add(promiseCreator) {
      if (this.currentSize === this.maxSize)
        return new Promise((resolve, reject) => {
          this.queue.push({ resolve, reject, promiseCreator });
        });
      else {
        this.currentSize += 1;
        return promiseCreator().then(
          value => {
            this.next();
            return Promise.resolve(value);
          },
          error => {
            this.next();
            return Promise.reject(error);
          }
        );
      }
    }
    next() {
      this.currentSize -= 1;
      if (this.queue.length === 0) return;
      const { promiseCreator, reject, resolve } = this.queue.shift();
      const wrapPromise = () => {
        return promiseCreator().then(
          value => resolve(value),
          error => reject(error)
        );
      };
      this.add(wrapPromise);
    }
  }
  
  const scheduler = new Scheduler(2);
  const generateTask = function(msg, time) {
    console.time(msg);
    return () => new Promise(resolve => setTimeout(() => resolve(msg), time));
  };
  const task1 = scheduler.add(generateTask("Task 1", 1000));
  task1.then(value => {
    console.log(value);
    console.timeEnd(value);
  });
  const task2 = scheduler.add(generateTask("Task 2", 2000));
  task2.then(value => {
    console.log(value);
    console.timeEnd(value);
  });
  const task3 = scheduler.add(generateTask("Task 3", 500));
  task3.then(value => {
    console.log(value);
    console.timeEnd(value);
  });
  const task4 = scheduler.add(generateTask("Task 4", 1200));
  task4.then(value => {
    console.log(value);
    console.timeEnd(value);
  });
  
  