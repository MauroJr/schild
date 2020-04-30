export {
  addInArrayAtPosition,
  removeFromArrayAtPosition,
  changeElementOfPositionInArray,
  when,
  replaceElementOfArray,
  partialRight,
  noop,
};

function compose(...fns: Function[]) {
  return (arg: any) => fns.reduce((acc, fn) => fn(acc), arg);
}

function partialRight(fn: Function, ...args: any) {
  return (...leftArgs: any) => fn(...leftArgs, ...args);
}

function addInArrayAtPosition(array: any[], element: any, position: number) {
  const arrayCopy = [...array];
  arrayCopy.splice(position, 0, element);
  return arrayCopy;
}

function removeFromArrayAtPosition(array: any[], position: number) {
  return array.reduce(
    (acc, value, idx) => (idx === position ? acc : [...acc, value]),
    []
  );
}

function changeElementOfPositionInArray(
  array: any[],
  from: number,
  to: number
) {
  const removeFromArrayAtPositionFrom = partialRight(
    removeFromArrayAtPosition,
    from
  );
  const addInArrayAtPositionTo = partialRight(
    addInArrayAtPosition,
    array[from],
    to
  );

  return compose(removeFromArrayAtPositionFrom, addInArrayAtPositionTo)(array);
}

function identity(value: any) {
  return value;
}

function when(value: any, predicate = identity) {
  return function callback(callback: Function) {
    if (predicate(value)) return callback(value);
  };
}

function replaceElementOfArray(array: any[]) {
  return function (options: any) {
    return array.map((element) =>
      options.when(element) ? options.for(element) : element
    );
  };
}

function noop() {}
