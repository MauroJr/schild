const sleep = async (time: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

function createUUID() {
  return Math.random().toString(36).substring(2, 15);
}

export async function addNewColumn(column: any): Promise<boolean> {
  await sleep(500);
  return { id: createUUID(), ...column };
}

export async function addNewCard(card: any): Promise<boolean> {
  await sleep(500);
  return { id: createUUID(), ...card };
}
