import fs from 'fs';
export const logCallback = (data: any) => {
  try {
    fs.appendFileSync('callback_debug.log', JSON.stringify(data) + '\n');
  } catch(e) {}
}
