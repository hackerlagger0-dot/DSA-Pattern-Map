import { Pattern } from '../types';

export const INITIAL_PATTERNS: Pattern[] = [
  {
    id: 'pat-1',
    slug: 'sliding-window',
    name: 'Sliding Window',
    category: 'Two Pointers & Sliding Window',
    difficulty: 'Easy',
    description:
      'Maintains a window of elements over contiguous subarrays/substrings to compute contiguous aggregates without redundant re-computations.',
    whenToUse: [
      'Problem asks for contiguous subarray or substring (e.g., longest, shortest, target sum).',
      'Input is an array, string, or sequence.',
      'Brute force checking all sub-segments takes O(N^2) or O(N^3).'
    ],
    keyInvariants: [
      'Expand right pointer `right` to include elements in window.',
      'Shrink left pointer `left` when condition/invariant is violated (or when looking for minimum length).',
      'Maintain running sum/frequency map as window slides.'
    ],
    commonTraps: [
      'Confusing contiguous window with non-contiguous subsequences (Subsequences require DP or Backtracking).',
      'Forgetting to update frequency count or hash map state when moving the left boundary.',
      'Off-by-one errors when calculating window size (`right - left + 1`).'
    ],
    timeComplexity: 'O(N) - Each element is added and removed from the window at most once.',
    spaceComplexity: 'O(K) or O(1) - Depends on hash map size (alphabet size K) or window tracking variables.',
    prerequisites: ['Arrays', 'Strings', 'Hash Maps', 'Two Pointers'],
    codeTemplate: {
      language: 'TypeScript',
      code: `function slidingWindow(arr: number[], k: number): number {
  let left = 0;
  let currentSum = 0;
  let maxSum = -Infinity;

  for (let right = 0; right < arr.length; right++) {
    currentSum += arr[right];

    // Maintain window size or shrink left boundary
    if (right >= k - 1) {
      maxSum = Math.max(maxSum, currentSum);
      currentSum -= arr[left];
      left++;
    }
  }
  return maxSum;
}`
    },
    confusedWith: [
      {
        patternName: 'Two Pointers (Opposite Ends)',
        difference: 'Two pointers start at ends moving inward on sorted data; Sliding window moves left/right boundaries in the same direction over contiguous segments.'
      },
      {
        patternName: 'Prefix Sum',
        difference: 'Prefix Sum allows O(1) range queries when window size varies independently without continuous shrinking/expanding conditions.'
      }
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'pat-2',
    slug: 'two-pointers',
    name: 'Two Pointers',
    category: 'Two Pointers & Sliding Window',
    difficulty: 'Easy',
    description:
      'Uses two references moving towards each other or at different speeds to solve search problems on sorted structures with minimal memory.',
    whenToUse: [
      'Input array or string is sorted (or can be sorted easily).',
      'Finding pairs, triplets, or subarrays that satisfy a target sum or condition.',
      'In-place array manipulation (e.g. remove duplicates, reverse).'
    ],
    keyInvariants: [
      'If current sum < target, increment left pointer to increase total.',
      'If current sum > target, decrement right pointer to decrease total.',
      'Avoid checking duplicate values by advancing pointers when adjacent elements are identical.'
    ],
    commonTraps: [
      'Forgetting to sort the input array first if order is required.',
      'Infinite loops due to improper pointer increment/decrement in nested loops.'
    ],
    timeComplexity: 'O(N) after sorting O(N log N).',
    spaceComplexity: 'O(1) in-place pointers.',
    prerequisites: ['Arrays', 'Sorting'],
    codeTemplate: {
      language: 'TypeScript',
      code: `function twoSumSorted(nums: number[], target: number): number[] {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return [];
}`
    },
    confusedWith: [
      {
        patternName: 'Binary Search',
        difference: 'Binary search finds a single element or boundary in O(log N). Two pointers search for multi-element combinations in O(N).'
      }
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'pat-3',
    slug: 'fast-slow-pointers',
    name: 'Fast & Slow Pointers (Floyd Cycle)',
    category: 'LinkedList Manipulation',
    difficulty: 'Medium',
    description:
      'Employs two pointers iterating at different speeds (slow moves 1 step, fast moves 2 steps) to detect cycles or find middle nodes.',
    whenToUse: [
      'Linked list or cyclic array structure.',
      'Detecting a cycle or finding the cycle entry point.',
      'Finding the middle of a linked list or happy number sequence.'
    ],
    keyInvariants: [
      'If a cycle exists, `fast` will eventually catch up and overlap with `slow`.',
      'The distance from start to cycle entry equals the distance from intersection point to cycle entry.'
    ],
    commonTraps: [
      'Accessing `fast.next.next` without checking if `fast` or `fast.next` is null.',
      'Failing to handle empty or 1-node linked lists.'
    ],
    timeComplexity: 'O(N) linear iteration.',
    spaceComplexity: 'O(1) auxiliary pointer memory.',
    prerequisites: ['Linked Lists', 'Pointers'],
    codeTemplate: {
      language: 'TypeScript',
      code: `function hasCycle(head: ListNode | null): boolean {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`
    },
    confusedWith: [
      {
        patternName: 'HashSet Cycle Detection',
        difference: 'HashSet detection uses O(N) auxiliary space. Fast & Slow pointers achieve O(1) space.'
      }
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'pat-4',
    slug: 'merge-intervals',
    name: 'Merge Intervals',
    category: 'Two Pointers & Sliding Window',
    difficulty: 'Medium',
    description:
      'Sorts intervals by start time and iteratively merges or identifies overlapping ranges.',
    whenToUse: [
      'Problem involves time ranges, intervals, scheduling, or overlapping boundaries.',
      'Finding total coverage, intersections, or minimum meeting rooms.'
    ],
    keyInvariants: [
      'Always sort intervals primarily by start time `interval[0]`.',
      'Interval B overlaps with Interval A if `B.start <= A.end`.',
      'Merged interval end becomes `max(A.end, B.end)`.'
    ],
    commonTraps: [
      'Forgetting to sort intervals before processing.',
      'Using `>` instead of `>=` when intervals touching at endpoints should or shouldn\'t be merged.'
    ],
    timeComplexity: 'O(N log N) dominated by sorting.',
    spaceComplexity: 'O(N) for storing merged output.',
    prerequisites: ['Sorting', 'Interval Representation'],
    codeTemplate: {
      language: 'TypeScript',
      code: `function mergeIntervals(intervals: number[][]): number[][] {
  if (intervals.length <= 1) return intervals;
  intervals.sort((a, b) => a[0] - b[0]);

  const result: number[][] = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const prev = result[result.length - 1];
    const curr = intervals[i];

    if (curr[0] <= prev[1]) {
      prev[1] = Math.max(prev[1], curr[1]);
    } else {
      result.push(curr);
    }
  }
  return result;
}`
    },
    confusedWith: [
      {
        patternName: 'Sweep Line / Priority Queue',
        difference: 'Simple merge intervals sorts static arrays. Meeting rooms or continuous point events require Min-Heaps or Sweep Line.'
      }
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'pat-5',
    slug: 'cyclic-sort',
    name: 'Cyclic Sort',
    category: 'Binary Search & Fast Search',
    difficulty: 'Medium',
    description:
      'Iterates through an array containing numbers in a known range (e.g. 1 to N) and swaps each number into its correct index position.',
    whenToUse: [
      'Array contains numbers in a bounded range `[1..N]` or `[0..N]`.',
      'Problem asks to find missing, duplicate, or misplaced numbers in O(N) time and O(1) space.'
    ],
    keyInvariants: [
      'Value `nums[i]` belongs at index `nums[i] - 1`.',
      'Only increment index `i` when `nums[i]` is already at its correct place or is out of bounds.'
    ],
    commonTraps: [
      'Using a standard `for` loop instead of `while` loop, which might skip checking swapped numbers at position `i`.'
    ],
    timeComplexity: 'O(N) - Each number is swapped at most once.',
    spaceComplexity: 'O(1) in-place sorting.',
    prerequisites: ['Arrays', 'In-place Swapping'],
    codeTemplate: {
      language: 'TypeScript',
      code: `function findMissingNumber(nums: number[]): number {
  let i = 0;
  const n = nums.length;
  while (i < n) {
    const correctIdx = nums[i];
    if (nums[i] < n && nums[i] !== nums[correctIdx]) {
      // Swap nums[i] to its correct index
      [nums[i], nums[correctIdx]] = [nums[correctIdx], nums[i]];
    } else {
      i++;
    }
  }
  for (let j = 0; j < n; j++) {
    if (nums[j] !== j) return j;
  }
  return n;
}`
    },
    confusedWith: [
      {
        patternName: 'General Sorting (QuickSort / MergeSort)',
        difference: 'General sorting takes O(N log N). Cyclic sort takes advantage of known value bounds [1..N] for O(N) in-place placement.'
      }
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'pat-6',
    slug: 'tree-bfs',
    name: 'Tree Breadth-First Search (BFS)',
    category: 'Trees & Graphs (BFS/DFS)',
    difficulty: 'Easy',
    description:
      'Explores binary trees level by level using a FIFO Queue structure.',
    whenToUse: [
      'Level-order traversal, level averages, minimum depth, or finding connected node neighbors by distance.'
    ],
    keyInvariants: [
      'Process current queue size `const size = queue.length` to distinguish nodes level by level.',
      'Enqueue left and right child nodes for the next level.'
    ],
    commonTraps: [
      'Re-evaluating `queue.length` inside loop condition without taking snapshot size.'
    ],
    timeComplexity: 'O(N) visits every node once.',
    spaceComplexity: 'O(W) where W is maximum width of the tree.',
    prerequisites: ['Trees', 'Queue Data Structure'],
    codeTemplate: {
      language: 'TypeScript',
      code: `function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];
  const result: number[][] = [];
  const queue: TreeNode[] = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel: number[] = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      currentLevel.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(currentLevel);
  }
  return result;
}`
    },
    confusedWith: [
      {
        patternName: 'Tree DFS',
        difference: 'DFS uses recursion/stack for deep paths. BFS uses FIFO queue for level boundaries and shortest paths.'
      }
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'pat-7',
    slug: 'tree-dfs',
    name: 'Tree Depth-First Search (DFS)',
    category: 'Trees & Graphs (BFS/DFS)',
    difficulty: 'Medium',
    description:
      'Traverses deep down tree branches recursively (Pre-order, In-order, Post-order) before backtracking.',
    whenToUse: [
      'Finding path sums, tree height, lowest common ancestor, or node paths matching a target property.'
    ],
    keyInvariants: [
      'Base cases return value when node is null or leaf.',
      'Post-order computes results bottom-up from children.'
    ],
    commonTraps: [
      'Forgetting base null checks resulting in recursion stack overflow.',
      'Modifying global backtracking state improperly across branches.'
    ],
    timeComplexity: 'O(N) visits every node once.',
    spaceComplexity: 'O(H) recursion stack height.',
    prerequisites: ['Trees', 'Recursion', 'Stack'],
    codeTemplate: {
      language: 'TypeScript',
      code: `function hasPathSum(root: TreeNode | null, targetSum: number): boolean {
  if (!root) return false;
  if (!root.left && !root.right) return root.val === targetSum;

  return (
    hasPathSum(root.left, targetSum - root.val) ||
    hasPathSum(root.right, targetSum - root.val)
  );
}`
    },
    confusedWith: [
      {
        patternName: 'Graph DFS',
        difference: 'Tree DFS has no cycles so no `visited` set is required. Graph DFS requires a `visited` tracking set.'
      }
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'pat-8',
    slug: 'subsets-backtracking',
    name: 'Subsets & Backtracking',
    category: 'Backtracking & Subsets',
    difficulty: 'Medium',
    description:
      'Explores all combinatorial possibilities (subsets, permutations, combinations) via recursive trial and error, pruning invalid paths.',
    whenToUse: [
      'Generating all combinations, permutations, or powersets.',
      'Sudoku solver, N-Queens, word search in grid.'
    ],
    keyInvariants: [
      'Choose: Add element to candidate array.',
      'Explore: Recursively invoke helper.',
      'Un-choose (Backtrack): Pop element from candidate array.'
    ],
    commonTraps: [
      'Pushing reference `path` to results instead of a copy `[...path]`.',
      'Forgetting to handle duplicates when problem specifies unique subsets.'
    ],
    timeComplexity: 'O(2^N) for subsets, O(N!) for permutations.',
    spaceComplexity: 'O(N) recursion tree depth.',
    prerequisites: ['Recursion', 'Decision Trees'],
    codeTemplate: {
      language: 'TypeScript',
      code: `function subsets(nums: number[]): number[][] {
  const result: number[][] = [];

  function backtrack(startIndex: number, currentPath: number[]) {
    result.push([...currentPath]); // Push shallow copy

    for (let i = startIndex; i < nums.length; i++) {
      currentPath.push(nums[i]);
      backtrack(i + 1, currentPath);
      currentPath.pop(); // Backtrack
    }
  }

  backtrack(0, []);
  return result;
}`
    },
    confusedWith: [
      {
        patternName: 'Dynamic Programming',
        difference: 'Backtracking enumerates all actual paths/combinations. DP counts or finds optimum without storing paths.'
      }
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'pat-9',
    slug: 'modified-binary-search',
    name: 'Modified Binary Search',
    category: 'Binary Search & Fast Search',
    difficulty: 'Medium',
    description:
      'Adapts binary search to operate on rotated arrays, unknown bounds, or monotonic search spaces.',
    whenToUse: [
      'Input is sorted, rotated sorted, or possesses a monotonic boolean predicate (e.g. `isPossible(x)`).',
      'Finding search space boundaries in O(log N).'
    ],
    keyInvariants: [
      'Calculate mid securely: `mid = Math.floor(left + (right - left) / 2)`.',
      'Identify which half is strictly sorted in rotated search.'
    ],
    commonTraps: [
      'Integer overflow with `(left + right) / 2`.',
      'Infinite loops with `while (left <= right)` when pointers fail to progress.'
    ],
    timeComplexity: 'O(log N).',
    spaceComplexity: 'O(1).',
    prerequisites: ['Binary Search', 'Sorting'],
    codeTemplate: {
      language: 'TypeScript',
      code: `function searchRotated(nums: number[], target: number): number {
  let left = 0, right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (nums[mid] === target) return mid;

    // Check if left side is sorted
    if (nums[left] <= nums[mid]) {
      if (target >= nums[left] && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      // Right side is sorted
      if (target > nums[mid] && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  return -1;
}`
    },
    confusedWith: [
      {
        patternName: 'Linear Search',
        difference: 'Linear search is O(N) on unsorted arrays. Modified binary search requires monotonic property to achieve O(log N).'
      }
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'pat-10',
    slug: 'top-k-elements',
    name: 'Top "K" Elements (Heap)',
    category: 'Heaps & Priority Queues',
    difficulty: 'Medium',
    description:
      'Uses a Min-Heap or Max-Heap to track the K largest or K smallest elements in a dataset.',
    whenToUse: [
      'Finding top K largest/smallest elements, Kth frequent element, or median streaming.'
    ],
    keyInvariants: [
      'To keep K largest elements, maintain a Min-Heap of size K. Pop root when size exceeds K.',
      'To keep K smallest elements, maintain a Max-Heap of size K.'
    ],
    commonTraps: [
      'Using Max-Heap when seeking top K largest, requiring full O(N log N) insertion instead of O(N log K).'
    ],
    timeComplexity: 'O(N log K) time.',
    spaceComplexity: 'O(K) auxiliary heap space.',
    prerequisites: ['Min-Heap', 'Max-Heap', 'Priority Queue'],
    codeTemplate: {
      language: 'TypeScript',
      code: `// Priority Queue pseudocode pattern for K largest
function findKthLargest(nums: number[], k: number): number {
  // MinHeap maintains k largest elements
  const minHeap = new MinPriorityQueue();

  for (const num of nums) {
    minHeap.enqueue(num);
    if (minHeap.size() > k) {
      minHeap.dequeue();
    }
  }
  return minHeap.front();
}`
    },
    confusedWith: [
      {
        patternName: 'QuickSelect',
        difference: 'QuickSelect finds the Kth element in O(N) average time but mutates the input array. Min-Heap streams online elements in O(N log K).'
      }
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'pat-11',
    slug: 'monotonic-stack',
    name: 'Monotonic Stack',
    category: 'Monotonic Stack & Queue',
    difficulty: 'Medium',
    description:
      'Maintains elements in strictly increasing or decreasing order inside a stack to answer "next greater element" queries in O(N).',
    whenToUse: [
      'Finding Next Greater Element, Previous Smaller Element, Daily Temperatures, Trapping Rainwater, Largest Rectangle in Histogram.'
    ],
    keyInvariants: [
      'For Next Greater Element: Maintain a monotonically decreasing stack.',
      'Pop elements from stack whenever current element is strictly greater than stack top.'
    ],
    commonTraps: [
      'Storing element values instead of element indices (storing indices allows calculating distance/width).'
    ],
    timeComplexity: 'O(N) amortized (each element pushed and popped at most once).',
    spaceComplexity: 'O(N) for stack storage.',
    prerequisites: ['Stack Data Structure'],
    codeTemplate: {
      language: 'TypeScript',
      code: `function dailyTemperatures(temperatures: number[]): number[] {
  const n = temperatures.length;
  const result: number[] = new Array(n).fill(0);
  const stack: number[] = []; // Stores indices

  for (let i = 0; i < n; i++) {
    while (
      stack.length > 0 &&
      temperatures[i] > temperatures[stack[stack.length - 1]]
    ) {
      const prevIndex = stack.pop()!;
      result[prevIndex] = i - prevIndex;
    }
    stack.push(i);
  }
  return result;
}`
    },
    confusedWith: [
      {
        patternName: 'Standard LIFO Stack',
        difference: 'Standard stack evaluates parentheses or expressions. Monotonic stack pops elements dynamically to maintain sorted order invariant.'
      }
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'pat-12',
    slug: 'dynamic-programming',
    name: 'Dynamic Programming (Knapsack & Memoization)',
    category: 'Dynamic Programming',
    difficulty: 'Hard',
    description:
      'Solves complex optimization/counting problems by breaking them down into overlapping subproblems with optimal substructure.',
    whenToUse: [
      'Maximum/minimum values, total ways to reach target, partition subsets, longest common subsequence.'
    ],
    keyInvariants: [
      'Identify state variables (e.g. `dp[i][w]`).',
      'Define state transition equation.',
      'Establish base cases (e.g., `dp[0] = 1`).'
    ],
    commonTraps: [
      'Failing to notice overlapping subproblems.',
      'Off-by-one errors in state table sizing.'
    ],
    timeComplexity: 'O(N * Capacity).',
    spaceComplexity: 'O(N * Capacity) or optimized to O(Capacity).',
    prerequisites: ['Recursion', 'Memoization', 'Tabulation'],
    codeTemplate: {
      language: 'TypeScript',
      code: `function coinChange(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`
    },
    confusedWith: [
      {
        patternName: 'Greedy Choice',
        difference: 'Greedy makes locally optimal choices without looking back. DP explores all overlapping subproblems systematically.'
      }
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'pat-13',
    slug: 'trie-prefix-tree',
    name: 'Trie (Prefix Tree)',
    category: 'Trie & Prefix Tree',
    difficulty: 'Medium',
    description:
      'A tree-like data structure used for storing strings where nodes represent characters along common prefix paths.',
    whenToUse: [
      'Autocomplete, spell checker, prefix matching, word search in grid, XOR maximum queries.'
    ],
    keyInvariants: [
      'Root node is empty.',
      'Each node contains a map or array of children links and an `isEndOfWord` flag.'
    ],
    commonTraps: [
      'Forgetting to mark `isEndOfWord = true` when inserting words.',
      'Assuming lowercase English letters only when input contains special characters.'
    ],
    timeComplexity: 'O(L) per search/insert where L is word length.',
    spaceComplexity: 'O(N * L) total characters.',
    prerequisites: ['Trees', 'Hash Maps'],
    codeTemplate: {
      language: 'TypeScript',
      code: `class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEnd: boolean = false;
}

class Trie {
  root = new TrieNode();

  insert(word: string): void {
    let curr = this.root;
    for (const char of word) {
      if (!curr.children.has(char)) {
        curr.children.set(char, new TrieNode());
      }
      curr = curr.children.get(char)!;
    }
    curr.isEnd = true;
  }

  startsWith(prefix: string): boolean {
    let curr = this.root;
    for (const char of prefix) {
      if (!curr.children.has(char)) return false;
      curr = curr.children.get(char)!;
    }
    return true;
  }
}`
    },
    confusedWith: [
      {
        patternName: 'HashSet / HashMap',
        difference: 'HashSet performs exact key match in O(L). Trie efficiently matches prefix keys and common substrings.'
      }
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'pat-14',
    slug: 'union-find',
    name: 'Union Find (Disjoint Set Union)',
    category: 'Union Find & Graph Algorithms',
    difficulty: 'Medium',
    description:
      'Manages a set of partitioned elements to efficiently perform Union operations and Find set representative with path compression.',
    whenToUse: [
      'Graph cycle detection in undirected graphs, connected components, Kruskal\'s MST, grid island connectivity.'
    ],
    keyInvariants: [
      'Path Compression: Point child nodes directly to root during `find(x)`.',
      'Union by Rank/Size: Attach smaller tree under larger root.'
    ],
    commonTraps: [
      'Forgetting path compression `parent[x] = find(parent[x])`, degrading runtime to O(N).'
    ],
    timeComplexity: 'O(alpha(N)) ~ near O(1) amortized with path compression.',
    spaceComplexity: 'O(N) parent array storage.',
    prerequisites: ['Graphs', 'Arrays'],
    codeTemplate: {
      language: 'TypeScript',
      code: `class UnionFind {
  parent: number[];
  rank: number[];

  constructor(size: number) {
    this.parent = Array.from({ length: size }, (_, i) => i);
    this.rank = new Array(size).fill(0);
  }

  find(i: number): number {
    if (this.parent[i] === i) return i;
    // Path compression
    this.parent[i] = this.find(this.parent[i]);
    return this.parent[i];
  }

  union(i: number, j: number): boolean {
    const rootI = this.find(i);
    const rootJ = this.find(j);
    if (rootI === rootJ) return false; // Cycle detected

    if (this.rank[rootI] < this.rank[rootJ]) {
      this.parent[rootI] = rootJ;
    } else if (this.rank[rootI] > this.rank[rootJ]) {
      this.parent[rootJ] = rootI;
    } else {
      this.parent[rootJ] = rootI;
      this.rank[rootI]++;
    }
    return true;
  }
}`
    },
    confusedWith: [
      {
        patternName: 'BFS / DFS Graph Traversal',
        difference: 'BFS/DFS navigates graph edges dynamically. DSU answers dynamic connectivity and merges component sets in near O(1) time.'
      }
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'pat-15',
    slug: 'prefix-sum',
    name: 'Prefix Sum & Difference Array',
    category: 'Bit Manipulation & Math',
    difficulty: 'Easy',
    description:
      'Precomputes cumulative sum arrays to allow O(1) contiguous range sum queries and range update tracking.',
    whenToUse: [
      'Multiple range sum queries `sum(L, R)` on a static array.',
      'Subarray sum equals K, contiguous array with equal 0s and 1s.'
    ],
    keyInvariants: [
      '`prefix[i] = prefix[i - 1] + nums[i - 1]`.',
      'Sum from index `L` to `R` is `prefix[R + 1] - prefix[L]`.'
    ],
    commonTraps: [
      'Off-by-one errors when initializing 1-indexed prefix array of length `N + 1`.'
    ],
    timeComplexity: 'O(N) build, O(1) per query.',
    spaceComplexity: 'O(N) auxiliary prefix storage.',
    prerequisites: ['Arrays', 'Math'],
    codeTemplate: {
      language: 'TypeScript',
      code: `function subarraySumEqualsK(nums: number[], k: number): number {
  let count = 0;
  let currentSum = 0;
  const prefixMap = new Map<number, number>();
  prefixMap.set(0, 1); // Base case for sum starting at index 0

  for (const num of nums) {
    currentSum += num;
    if (prefixMap.has(currentSum - k)) {
      count += prefixMap.get(currentSum - k)!;
    }
    prefixMap.set(currentSum, (prefixMap.get(currentSum) || 0) + 1);
  }
  return count;
}`
    },
    confusedWith: [
      {
        patternName: 'Sliding Window',
        difference: 'Sliding window works when elements are non-negative so expanding/shrinking has monotonic behavior. Prefix Sum works even with negative numbers.'
      }
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  }
];
