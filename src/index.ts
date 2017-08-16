export function singlify(fn: Function): Function {
  let running = false;
  let pending = false;
  return async function() {
    if (running) {
      pending = true;
      return;
    }
    running = true;
    do {
      pending = false;
      await fn();
    } while (pending);
    running = false;
  };
}

export function singly(_target: any, _name: string, desc: any) {
  if (typeof desc.value !== 'function') {
    throw new Error('@singly can only be used on methods');
  }
  if (desc.value.length > 0) {
    throw new Error('@singly can only be applied on methods without any arguments');
  }
  desc.value = singlify(desc.value);
}
