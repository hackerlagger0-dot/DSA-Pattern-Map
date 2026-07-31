import { Problem } from '../types';

export const INITIAL_PROBLEMS: Problem[] = [
  {
    id: 'prob-101',
    slug: 'maximum-sum-subarray-of-size-k',
    title: 'Maximum Sum Subarray of Size K',
    leetcodeUrl: 'https://leetcode.com/problems/maximum-subarray/',
    difficulty: 'Easy',
    patternId: 'pat-1',
    patternName: 'Sliding Window',
    statement:
      'Given an array of positive numbers and a positive number `k`, find the maximum sum of any contiguous subarray of size `k`.',
    constraints: ['1 <= nums.length <= 10^5', '1 <= k <= nums.length', '1 <= nums[i] <= 10^4'],
    examples: [
      {
        input: 'nums = [2, 1, 5, 1, 3, 2], k = 3',
        output: '9',
        explanation: 'Subarray with maximum sum is [5, 1, 3] with sum = 9.'
      },
      {
        input: 'nums = [2, 3, 4, 1, 5], k = 2',
        output: '7',
        explanation: 'Subarray with maximum sum is [3, 4] with sum = 7.'
      }
    ],
    patternTriggers: [
      'Contiguous subarray constraint',
      'Fixed window size `k`',
      'Maximizing aggregate metric (sum)'
    ],
    commonWrongPatterns: [
      'Two Pointers (Opposite ends)',
      'Dynamic Programming',
      'Sorting'
    ],
    hints: [
      'Can you reuse the sum of overlapping elements when moving from index `i` to `i+1`?',
      'Add the next element at `right` pointer and subtract the leftmost element at `left` pointer.',
      'Maintain a running window sum as `right` iterates from 0 to N-1.'
    ],
    solutionExplanation:
      'Using Fixed Sliding Window of length k: Keep a `currentSum`. For each step, add `nums[right]`. When `right >= k - 1`, record `maxSum = max(maxSum, currentSum)` and subtract `nums[left]` before incrementing `left`. Time O(N), Space O(1).',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'prob-102',
    slug: 'longest-substring-without-repeating-characters',
    title: 'Longest Substring Without Repeating Characters',
    leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    difficulty: 'Medium',
    patternId: 'pat-1',
    patternName: 'Sliding Window',
    statement:
      'Given a string `s`, find the length of the longest substring without repeating characters.',
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.'
      }
    ],
    patternTriggers: [
      'Contiguous substring search',
      'Variable window size',
      'Unique/non-repeating elements constraint'
    ],
    commonWrongPatterns: [
      'Backtracking (O(2^N) too slow)',
      'Prefix Sum',
      'Binary Search'
    ],
    hints: [
      'Use a Hash Map or Set to track frequency/last seen index of each character.',
      'Expand `right` pointer to include characters in current window.',
      'When a duplicate is encountered, shrink `left` pointer past the previous index of that duplicate.'
    ],
    solutionExplanation:
      'Variable Sliding Window with Last Seen Index Map: Map stores character -> last seen index. If char is in map and index >= left, update `left = map.get(char) + 1`. Calculate length `right - left + 1`. Time O(N), Space O(min(N, AlphabetSize)).',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'prob-103',
    slug: 'two-sum-ii-input-array-is-sorted',
    title: 'Two Sum II - Input Array Is Sorted',
    leetcodeUrl: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
    difficulty: 'Easy',
    patternId: 'pat-2',
    patternName: 'Two Pointers',
    statement:
      'Given a 1-indexed array of integers `numbers` that is already sorted in non-decreasing order, find two numbers such that they add up to a specific `target` number.',
    constraints: ['2 <= numbers.length <= 3 * 10^4', '-1000 <= numbers[i] <= 1000', 'numbers is sorted in non-decreasing order'],
    examples: [
      {
        input: 'numbers = [2, 7, 11, 15], target = 9',
        output: '[1, 2]',
        explanation: 'The sum of 2 and 7 is 9. Therefore, index1 = 1, index2 = 2.'
      }
    ],
    patternTriggers: [
      'Input array is ALREADY SORTED',
      'Find pair matching target sum',
      'O(1) extra space required'
    ],
    commonWrongPatterns: [
      'HashMap (Uses O(N) space when O(1) is requested)',
      'Brute Force Nested Loop (O(N^2))'
    ],
    hints: [
      'Set `left = 0` and `right = N - 1`.',
      'Calculate `sum = numbers[left] + numbers[right]`.',
      'If sum < target, increment left. If sum > target, decrement right.'
    ],
    solutionExplanation:
      'Two Pointers at opposite ends: Because the array is sorted, incrementing `left` increases the sum and decrementing `right` decreases the sum. Time O(N), Space O(1).',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'prob-104',
    slug: 'linked-list-cycle',
    title: 'Linked List Cycle',
    leetcodeUrl: 'https://leetcode.com/problems/linked-list-cycle/',
    difficulty: 'Easy',
    patternId: 'pat-3',
    patternName: 'Fast & Slow Pointers (Floyd Cycle)',
    statement:
      'Given `head`, the head of a linked list, determine if the linked list has a cycle in it. Return `true` if there is a cycle, otherwise `false`.',
    constraints: ['Number of nodes in the list is in the range [0, 10^4]', '-10^5 <= Node.val <= 10^5'],
    examples: [
      {
        input: 'head = [3, 2, 0, -4], pos = 1',
        output: 'true',
        explanation: 'There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).'
      }
    ],
    patternTriggers: [
      'Linked list structure',
      'Cycle detection / loop search',
      'O(1) space constraint'
    ],
    commonWrongPatterns: [
      'HashSet tracking nodes (Uses O(N) auxiliary memory)',
      'Modifying Node values (Destructive)'
    ],
    hints: [
      'Imagine two runners on a circular track where one moves twice as fast as the other.',
      'Initialize `slow = head` and `fast = head`.',
      'In each step, `slow = slow.next` and `fast = fast.next.next`. If they meet, a cycle exists.'
    ],
    solutionExplanation:
      'Floyd\'s Cycle Finding algorithm: If a cycle exists, the fast pointer will eventually catch up and equal slow pointer. If fast reaches null, no cycle exists. Time O(N), Space O(1).',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'prob-105',
    slug: 'merge-intervals-problem',
    title: 'Merge Intervals',
    leetcodeUrl: 'https://leetcode.com/problems/merge-intervals/',
    difficulty: 'Medium',
    patternId: 'pat-4',
    patternName: 'Merge Intervals',
    statement:
      'Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    constraints: ['1 <= intervals.length <= 10^4', 'intervals[i].length == 2', '0 <= start_i <= end_i <= 10^4'],
    examples: [
      {
        input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
        output: '[[1,6],[8,10],[15,18]]',
        explanation: 'Intervals [1,3] and [2,6] overlap, merging into [1,6].'
      }
    ],
    patternTriggers: [
      'Overlapping range intervals [start, end]',
      'Consolidating ranges or time schedules',
      'Sorting range boundaries'
    ],
    commonWrongPatterns: [
      'Graph Traversal / Connected Components',
      'Brute force pairwise comparison O(N^2)'
    ],
    hints: [
      'Sort intervals by their start time `a[0] - b[0]`.',
      'Iterate through sorted intervals. Check if `curr.start <= prev.end`.',
      'If overlapping, merge by setting `prev.end = max(prev.end, curr.end)`.'
    ],
    solutionExplanation:
      'Sort intervals by start time. Maintain a list of merged intervals. Compare current interval with last merged interval. Time O(N log N), Space O(N).',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'prob-106',
    slug: 'find-the-duplicate-number',
    title: 'Find the Duplicate Number',
    leetcodeUrl: 'https://leetcode.com/problems/find-the-duplicate-number/',
    difficulty: 'Medium',
    patternId: 'pat-5',
    patternName: 'Cyclic Sort',
    statement:
      'Given an array of integers `nums` containing `n + 1` integers where each integer is in the range `[1, n]` inclusive, return the duplicate number without modifying the array and using only O(1) extra space.',
    constraints: ['1 <= n <= 10^5', 'nums.length == n + 1', '1 <= nums[i] <= n'],
    examples: [
      {
        input: 'nums = [1,3,4,2,2]',
        output: '2'
      }
    ],
    patternTriggers: [
      'Array elements bounded in range [1..n]',
      'Finding misplaced/duplicate element',
      'Constant auxiliary space O(1)'
    ],
    commonWrongPatterns: [
      'Sorting (Mutates input or takes O(N log N))',
      'HashSet (O(N) space)'
    ],
    hints: [
      'Notice that the numbers are in range [1, n]. Each number points to an index in the array.',
      'You can treat this as a linked list cycle problem (Fast & Slow Pointers) OR perform cyclic placement.',
      'Find the cycle intersection point.'
    ],
    solutionExplanation:
      'Cyclic Placement or Fast/Slow Pointers on Array Indices: Since values are between 1 and n, treat `nums[i]` as a pointer `i -> nums[i]`. Find intersection point of fast and slow pointers. Time O(N), Space O(1).',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'prob-107',
    slug: 'binary-tree-level-order-traversal',
    title: 'Binary Tree Level Order Traversal',
    leetcodeUrl: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
    difficulty: 'Medium',
    patternId: 'pat-6',
    patternName: 'Tree Breadth-First Search (BFS)',
    statement:
      'Given the `root` of a binary tree, return the level order traversal of its nodes\' values. (i.e., from left to right, level by level).',
    constraints: ['Number of nodes in the tree is in the range [0, 2000]', '-1000 <= Node.val <= 1000'],
    examples: [
      {
        input: 'root = [3,9,20,null,null,15,7]',
        output: '[[3],[9,20],[15,7]]'
      }
    ],
    patternTriggers: [
      'Tree structure traversal',
      'Level-by-level ordering',
      'Shortest path or depth grouping'
    ],
    commonWrongPatterns: [
      'Recursive In-order DFS (Requires manual depth map management)',
      'Pre-order Stack'
    ],
    hints: [
      'Use a Queue (FIFO data structure).',
      'At each iteration of the outer loop, record `queue.length` as the number of nodes on the current level.',
      'Pop all current level nodes, collect their values, and enqueue their children.'
    ],
    solutionExplanation:
      'Standard Tree BFS level order traversal using FIFO queue. Freeze current level size, dequeue elements into level list, enqueue left and right children. Time O(N), Space O(N).',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'prob-108',
    slug: 'path-sum',
    title: 'Path Sum',
    leetcodeUrl: 'https://leetcode.com/problems/path-sum/',
    difficulty: 'Easy',
    patternId: 'pat-7',
    patternName: 'Tree Depth-First Search (DFS)',
    statement:
      'Given the `root` of a binary tree and an integer `targetSum`, return `true` if the tree has a root-to-leaf path such that adding up all the values along the path equals `targetSum`.',
    constraints: ['Number of nodes in the tree is in the range [0, 5000]', '-1000 <= Node.val <= 1000'],
    examples: [
      {
        input: 'root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22',
        output: 'true'
      }
    ],
    patternTriggers: [
      'Root-to-leaf path calculation',
      'Recursive tree path verification',
      'Accumulating node value paths'
    ],
    commonWrongPatterns: [
      'Tree BFS (Works, but uses more memory for storing full paths)',
      'Dynamic Programming'
    ],
    hints: [
      'Subproblem: Does either left or right subtree have a path sum equal to `targetSum - root.val`?',
      'Check if current node is a leaf node (`!node.left && !node.right`).',
      'Base case: Return false if root is null.'
    ],
    solutionExplanation:
      'Tree DFS Recursion: Base case null -> false. Leaf node -> check if `root.val === targetSum`. Return `dfs(left, target - root.val) || dfs(right, target - root.val)`. Time O(N), Space O(H).',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'prob-109',
    slug: 'subsets-problem',
    title: 'Subsets',
    leetcodeUrl: 'https://leetcode.com/problems/subsets/',
    difficulty: 'Medium',
    patternId: 'pat-8',
    patternName: 'Subsets & Backtracking',
    statement:
      'Given an integer array `nums` of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets.',
    constraints: ['1 <= nums.length <= 10', '-10 <= nums[i] <= 10', 'All elements of nums are unique'],
    examples: [
      {
        input: 'nums = [1,2,3]',
        output: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]'
      }
    ],
    patternTriggers: [
      'Generate all combinations/powerset',
      'Exploration of decision tree branches',
      'Constraint: No duplicates'
    ],
    commonWrongPatterns: [
      'Sliding Window',
      'Greedy Algorithm'
    ],
    hints: [
      'For each element, you have two choices: include it in the current subset or exclude it.',
      'Use a recursive `backtrack(startIndex, currentPath)` function.',
      'At each recursive step, push a snapshot `[...currentPath]` to the output array.'
    ],
    solutionExplanation:
      'Recursive Backtracking: Loop from `startIndex` to N-1, push `nums[i]`, recurse `backtrack(i + 1)`, then pop `nums[i]`. Time O(2^N), Space O(N).',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'prob-110',
    slug: 'search-in-rotated-sorted-array',
    title: 'Search in Rotated Sorted Array',
    leetcodeUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
    difficulty: 'Medium',
    patternId: 'pat-9',
    patternName: 'Modified Binary Search',
    statement:
      'Given the array `nums` after the possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums`. You must write an algorithm with O(log n) runtime complexity.',
    constraints: ['1 <= nums.length <= 5000', '-10^4 <= nums[i] <= 10^4', 'O(log N) required'],
    examples: [
      {
        input: 'nums = [4,5,6,7,0,1,2], target = 0',
        output: '4'
      }
    ],
    patternTriggers: [
      'Array is sorted then rotated',
      'Target search in O(log N) time complexity',
      'Monotonic sorted half invariant'
    ],
    commonWrongPatterns: [
      'Linear Scan (O(N) too slow for requirement)',
      'Sorting array again (O(N log N))'
    ],
    hints: [
      'When you divide a rotated sorted array in half, AT LEAST ONE half is guaranteed to be strictly sorted.',
      'Check if `nums[left] <= nums[mid]`. If true, left half is sorted.',
      'Check if target lies inside the range of the sorted half.'
    ],
    solutionExplanation:
      'Modified Binary Search: Determine sorted half by comparing `nums[left]` and `nums[mid]`. If target lies within bounds of sorted half, search there; otherwise search opposite half. Time O(log N), Space O(1).',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'prob-111',
    slug: 'kth-largest-element-in-an-array',
    title: 'Kth Largest Element in an Array',
    leetcodeUrl: 'https://leetcode.com/problems/kth-largest-element-in-an-array/',
    difficulty: 'Medium',
    patternId: 'pat-10',
    patternName: 'Top "K" Elements (Heap)',
    statement:
      'Given an integer array `nums` and an integer `k`, return the `k`th largest element in the array.',
    constraints: ['1 <= k <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    examples: [
      {
        input: 'nums = [3,2,1,5,6,4], k = 2',
        output: '5'
      }
    ],
    patternTriggers: [
      'Finding Kth largest or smallest element',
      'Streaming dataset or large input',
      'Min-Heap boundary tracking'
    ],
    commonWrongPatterns: [
      'Full Array Sort (O(N log N))',
      'Max-Heap of size N (O(N log N))'
    ],
    hints: [
      'To find the K largest elements, maintain a Min-Heap of size K.',
      'Iterate through the array. Enqueue each number into the Min-Heap.',
      'If heap size exceeds K, dequeue the root (smallest element). The remaining top of heap is the Kth largest.'
    ],
    solutionExplanation:
      'Min-Heap size K: Push elements into Min-Heap. Whenever size > k, pop root. After iterating, root contains the Kth largest element. Time O(N log K), Space O(K).',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'prob-112',
    slug: 'daily-temperatures',
    title: 'Daily Temperatures',
    leetcodeUrl: 'https://leetcode.com/problems/daily-temperatures/',
    difficulty: 'Medium',
    patternId: 'pat-11',
    patternName: 'Monotonic Stack',
    statement:
      'Given an array of integers `temperatures` represents the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i`th day to get a warmer temperature.',
    constraints: ['1 <= temperatures.length <= 10^5', '30 <= temperatures[i] <= 100'],
    examples: [
      {
        input: 'temperatures = [73,74,75,71,69,72,76,73]',
        output: '[1,1,4,2,1,1,0,0]'
      }
    ],
    patternTriggers: [
      'Finding Next Greater Element',
      'Distance/wait time to next higher value',
      'Array scan in O(N) linear time'
    ],
    commonWrongPatterns: [
      'Nested loops comparing future days (O(N^2) time limit exceeded)',
      'Queue Traversal'
    ],
    hints: [
      'Use a Monotonically Decreasing Stack storing day indices.',
      'When considering day `i`, while stack is non-empty and `temperatures[i] > temperatures[stack.top]`, pop index `prev` and compute `answer[prev] = i - prev`.',
      'Push index `i` onto the stack.'
    ],
    solutionExplanation:
      'Monotonic Stack storing indices: Stack maintains temperatures in decreasing order. When a warmer day arrives, pop cooler days from stack and compute index distance `i - prevIndex`. Time O(N), Space O(N).',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'prob-113',
    slug: 'coin-change',
    title: 'Coin Change',
    leetcodeUrl: 'https://leetcode.com/problems/coin-change/',
    difficulty: 'Medium',
    patternId: 'pat-12',
    patternName: 'Dynamic Programming (Knapsack & Memoization)',
    statement:
      'You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money. Return the fewest number of coins that you need to make up that amount.',
    constraints: ['1 <= coins.length <= 12', '1 <= coins[i] <= 2^31 - 1', '0 <= amount <= 10^4'],
    examples: [
      {
        input: 'coins = [1,2,5], amount = 11',
        output: '3',
        explanation: '11 = 5 + 5 + 1'
      }
    ],
    patternTriggers: [
      'Minimum number of steps/items to reach total target',
      'Overlapping coin choices',
      'Unbounded Knapsack'
    ],
    commonWrongPatterns: [
      'Greedy Coin Choice (Fails for denomination sets like [1, 3, 4, 5] target 7)',
      'Plain Recursion without Memoization (Exponential time)'
    ],
    hints: [
      'Define `dp[i]` as the minimum coins needed to make amount `i`.',
      'Base case: `dp[0] = 0`, all other `dp` entries initialized to Infinity.',
      'For each amount `i` from 1 to `amount`, test each coin: `dp[i] = min(dp[i], dp[i - coin] + 1)`.'
    ],
    solutionExplanation:
      'Bottom-up Dynamic Programming (Unbounded Knapsack): `dp[i]` represents min coins for amount `i`. Iterate `i` from 1 to `amount`, updating `dp[i] = min(dp[i], dp[i - coin] + 1)`. Time O(N * Amount), Space O(Amount).',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'prob-114',
    slug: 'implement-trie-prefix-tree',
    title: 'Implement Trie (Prefix Tree)',
    leetcodeUrl: 'https://leetcode.com/problems/implement-trie-prefix-tree/',
    difficulty: 'Medium',
    patternId: 'pat-13',
    patternName: 'Trie (Prefix Tree)',
    statement:
      'A trie (pronounced as "try") or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. Implement the Trie class with insert, search, and startsWith methods.',
    constraints: ['1 <= word.length, prefix.length <= 2000', 'word and prefix consist only of lowercase English letters.'],
    examples: [
      {
        input: 'insert("apple"), search("apple"), search("app"), startsWith("app")',
        output: 'true, false, true'
      }
    ],
    patternTriggers: [
      'Fast prefix query matching',
      'Dictionary lookup / autocomplete',
      'Tree structure keyed by character steps'
    ],
    commonWrongPatterns: [
      'HashSet (Cannot answer `startsWith` prefix queries in O(Length))'
    ],
    hints: [
      'Create a `TrieNode` class containing a children Map or fixed Array of size 26.',
      'Include a boolean `isEndOfWord` flag in each node.',
      'To insert, traverse node by node; create new nodes if character path doesn\'t exist.'
    ],
    solutionExplanation:
      'Trie Prefix Tree implementation: Insert creates nodes character by character and sets `isEnd = true` at termination. `startsWith` verifies complete character path existence. Time O(L) per operation, Space O(N * L).',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'prob-115',
    slug: 'number-of-provinces',
    title: 'Number of Provinces',
    leetcodeUrl: 'https://leetcode.com/problems/number-of-provinces/',
    difficulty: 'Medium',
    patternId: 'pat-14',
    patternName: 'Union Find (Disjoint Set Union)',
    statement:
      'There are `n` cities. Some of them are connected, while some are not. Given an `n x n` matrix `isConnected`, return the total number of provinces (connected components).',
    constraints: ['1 <= n <= 200', 'isConnected[i][j] is 1 or 0'],
    examples: [
      {
        input: 'isConnected = [[1,1,0],[1,1,0],[0,0,1]]',
        output: '2'
      }
    ],
    patternTriggers: [
      'Dynamic graph component counting',
      'Connecting nodes via edge pairs',
      'Disjoint set partitioning'
    ],
    commonWrongPatterns: [
      'Dijkstra Shortest Path',
      'Topological Sort'
    ],
    hints: [
      'Initialize UnionFind with `n` disjoint sets.',
      'Iterate over matrix `isConnected[i][j] === 1`. If city `i` and city `j` are connected, perform `union(i, j)`.',
      'Count distinct root representatives `find(i)` or decrement component count on successful unions.'
    ],
    solutionExplanation:
      'Disjoint Set Union (DSU) with Path Compression: Initialize count = n. Iterate matrix edges; for each connected edge pair (i, j), if union succeeds, decrement count. Return count. Time O(N^2 alpha(N)), Space O(N).',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'prob-116',
    slug: 'subarray-sum-equals-k',
    title: 'Subarray Sum Equals K',
    leetcodeUrl: 'https://leetcode.com/problems/subarray-sum-equals-k/',
    difficulty: 'Medium',
    patternId: 'pat-15',
    patternName: 'Prefix Sum & Difference Array',
    statement:
      'Given an array of integers `nums` and an integer `k`, return the total number of subarrays whose sum equals to `k`.',
    constraints: ['1 <= nums.length <= 2 * 10^4', '-1000 <= nums[i] <= 1000', '-10^7 <= k <= 10^7'],
    examples: [
      {
        input: 'nums = [1,1,1], k = 2',
        output: '2'
      },
      {
        input: 'nums = [1,2,3], k = 3',
        output: '2'
      }
    ],
    patternTriggers: [
      'Subarray sum equals target K',
      'Array contains negative numbers (Sliding window non-monotonic)',
      'O(N) time efficiency constraint'
    ],
    commonWrongPatterns: [
      'Sliding Window (Fails when negative numbers exist because window sum is not monotonic)',
      'Brute Force Nested Subarrays O(N^2)'
    ],
    hints: [
      'If `sum(0..j) - sum(0..i) = k`, then `sum(i+1..j) = k`.',
      'Maintain a running sum `currentSum`. We need to find how many times `currentSum - k` occurred previously.',
      'Store frequency of each prefix sum in a Hash Map initialized with `{0: 1}`.'
    ],
    solutionExplanation:
      'Prefix Sum + HashMap Frequency Map: Keep `currentSum`. Add frequency of `currentSum - k` to total count. Increment frequency of `currentSum` in map. Time O(N), Space O(N).',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  }
];
