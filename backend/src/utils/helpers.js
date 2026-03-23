import { v4 as uuidv4 } from 'uuid';

export function generateId() {
  return uuidv4();
}

export function getCurrentTimestamp() {
  return new Date().toISOString();
}

export function promisifyDb(db) {
  return {
    run: (sql, params = []) =>
      new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
          if (err) reject(err);
          else resolve(this);
        });
      }),
    get: (sql, params = []) =>
      new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      }),
    all: (sql, params = []) =>
      new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      }),
  };
}
