const pick = <T extends Record<string, unknown>, k extends keyof T>(
  obj: T,
  keys: k[]
) => {
  const finalObje: Partial<T> = {};
  for (const key of keys) {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      finalObje[key] = obj[key];
    }
  }

  return finalObje;
};

export default pick;
