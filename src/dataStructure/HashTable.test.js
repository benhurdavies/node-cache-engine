import HashTable from './HashTable';
import { get, add, remove, clear, size, has } from '../hashTableSymbol';

describe('HastTable', () => {
  it('should add and get items', () => {
    const hashTable = new HashTable();
    hashTable[add]('mango', 5);
    expect(hashTable[size]()).toBe(1);
    expect(hashTable[get]('mango')).toBe(5);
  });

  it('should add and delete items', () => {
    const hashTable = new HashTable();
    hashTable[add]('mango', 5);
    hashTable[add]('apple', 2);
    hashTable[remove]('mango');
    expect(hashTable[size]()).toBe(1);
    expect(hashTable[get]('apple')).toBe(2);
    expect(hashTable[get]('mango')).toBe(undefined);
  });

  it('should add elements and clean all together',()=>{
    const hashTable = new HashTable();
    hashTable[add]('mango', 5);
    hashTable[add]('apple', 2);
    hashTable[clear]();
    expect(hashTable[size]()).toBe(0);
    expect(hashTable[get]('apple')).toBe(undefined);
    expect(hashTable[get]('mango')).toBe(undefined);
  });

  it('should has to check a key is exist or not',()=>{
    const hashTable = new HashTable();
    hashTable[add]('mango', 5);
    expect(hashTable[has]('apple')).toBe(false);
    expect(hashTable[has]('mango')).toBe(true);
  })
});
