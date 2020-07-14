function MaxHeap(capacity) {
  let size = 0;
  let tree = capacity ? new Array(capacity) : [];

  const getLeftChildIndex = parentIndex => 2 * parentIndex + 1;
  const getRightChildIndex = parentIndex => 2 * parentIndex + 2;
  const getParentIndex = childIndex => ((childIndex - 1) / 2) | 0;

  const hasLeftChild = parentIndex => getLeftChildIndex(parentIndex) < size;
  const hasRightChild = parentIndex => getRightChildIndex(parentIndex) < size;
  const hasParent = childIndex => getParentIndex(childIndex) >= 0;

  const leftChild = parentIndex => tree[getLeftChildIndex(parentIndex)];
  const rightChild = parentIndex => tree[getRightChildIndex(parentIndex)];
  const parent = childIndex => tree[getParentIndex(childIndex)];
}

export default MaxHeap;
