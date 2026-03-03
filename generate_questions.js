const fs = require('fs');

const easyData = [
    ["Two Sum", "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.", "two_sum(nums, target)", "two_sum([2,7,11,15], 9) == [0, 1]", "two_sum([3,2,4], 6) == [1, 2]"],
    ["Palindrome Number", "Given an integer x, return true if x is a palindrome, and false otherwise.", "is_palindrome(x)", "is_palindrome(121) == True", "is_palindrome(-121) == False"],
    ["Reverse String", "Write a function that reverses a string.", "reverse_string(s)", "reverse_string('hello') == 'olleh'", "reverse_string('abcd') == 'dcba'"],
    ["Sum Array", "Return the sum of all elements in an array.", "sum_array(arr)", "sum_array([1,2,3]) == 6", "sum_array([-1, 1]) == 0"],
    ["Find Maximum", "Return the largest number in the array.", "find_max(arr)", "find_max([1,5,3]) == 5", "find_max([-10,-5]) == -5"],
    ["Find Minimum", "Return the smallest number in the array.", "find_min(arr)", "find_min([1,5,3]) == 1", "find_min([-10,-5]) == -10"],
    ["Count Vowels", "Count the number of vowels (a,e,i,o,u) in a string.", "count_vowels(s)", "count_vowels('hello') == 2", "count_vowels('apple') == 2"],
    ["Is Even", "Return True if n is even, False otherwise.", "is_even(n)", "is_even(4) == True", "is_even(7) == False"],
    ["Is Odd", "Return True if n is odd, False otherwise.", "is_odd(n)", "is_odd(5) == True", "is_odd(2) == False"],
    ["Factorial", "Return the factorial of n.", "factorial(n)", "factorial(5) == 120", "factorial(3) == 6"],
    ["Fibonacci", "Return the n-th Fibonacci number (n=0 returns 0, n=1 returns 1).", "fibonacci(n)", "fibonacci(5) == 5", "fibonacci(7) == 13"],
    ["GCD", "Return the greatest common divisor of a and b.", "gcd(a, b)", "gcd(12, 8) == 4", "gcd(7, 3) == 1"],
    ["Check Prime", "Return True if n is a prime number, False otherwise.", "is_prime(n)", "is_prime(7) == True", "is_prime(10) == False"],
    ["Sum of Digits", "Return the sum of the digits of a positive integer n.", "sum_digits(n)", "sum_digits(123) == 6", "sum_digits(405) == 9"],
    ["Reverse Digits", "Reverse the digits of a number. (Assume positive)", "reverse_digits(n)", "reverse_digits(123) == 321", "reverse_digits(400) == 4"],
    ["Count Set Bits", "Count the number of 1s in the binary representation of n.", "count_bits(n)", "count_bits(5) == 2", "count_bits(7) == 3"],
    ["FizzBuzz", "Return 'Fizz' if n is divisible by 3, 'Buzz' if by 5, 'FizzBuzz' if both, else return str(n).", "fizz_buzz(n)", "fizz_buzz(15) == 'FizzBuzz'", "fizz_buzz(3) == 'Fizz'"],
    ["Leap Year", "Return True if year is a leap year, False otherwise.", "is_leap(year)", "is_leap(2020) == True", "is_leap(2021) == False"],
    ["String Length", "Return the length of the string without using the len() function directly (just write it, however).", "string_len(s)", "string_len('hello') == 5", "string_len('') == 0"],
    ["Count Consonants", "Count consonants in a string (letters that are not vowels).", "count_consonants(s)", "count_consonants('hello') == 3", "count_consonants('world') == 4"],
    ["Square Root", "Return the integer part of the square root of n.", "int_sqrt(n)", "int_sqrt(9) == 3", "int_sqrt(15) == 3"],
    ["Power of Two", "Return True if n is a power of two, False otherwise.", "is_power_of_two(n)", "is_power_of_two(16) == True", "is_power_of_two(14) == False"],
    ["Remove Spaces", "Return the string with all spaces removed.", "remove_spaces(s)", "remove_spaces('a b c') == 'abc'", "remove_spaces(' x ') == 'x'"],
    ["Anagram Check", "Return True if s1 is an anagram of s2.", "is_anagram(s1, s2)", "is_anagram('listen', 'silent') == True", "is_anagram('hello', 'world') == False"],
    ["Sort Array", "Return the array sorted in ascending order.", "sort_array(arr)", "sort_array([3,1,2]) == [1,2,3]", "sort_array([5,0,-1]) == [-1,0,5]"],
    ["Remove Element", "Remove all occurrences of val from arr and return the new array.", "remove_val(arr, val)", "remove_val([1,2,2,3], 2) == [1,3]", "remove_val([5,5], 5) == []"],
    ["First Element", "Return the first element of the array. If empty, return None.", "first_element(arr)", "first_element([5,2]) == 5", "first_element([]) == None"],
    ["Last Element", "Return the last element of the array. If empty, return None.", "last_element(arr)", "last_element([5,2]) == 2", "last_element([]) == None"],
    ["Average", "Return the average of the array of numbers. If empty, return 0.", "average(arr)", "average([1,2,3]) == 2.0", "average([]) == 0"],
    ["List Intersection", "Return the common elements between two lists, sorted.", "intersection(l1, l2)", "intersection([1,2,3], [2,3,4]) == [2,3]", "intersection([1], [2]) == []"],
    ["List Union", "Return all unique elements from two lists, sorted.", "union(l1, l2)", "union([1,2], [2,3]) == [1,2,3]", "union([1], [2]) == [1,2]"],
    ["Celsius to Fahrenheit", "Convert Celsius temperature to Fahrenheit (F = C * 9/5 + 32).", "c_to_f(c)", "c_to_f(0) == 32", "c_to_f(100) == 212"],
    ["Fahrenheit to Celsius", "Convert Fahrenheit to Celsius (C = (F - 32) * 5/9).", "f_to_c(f)", "f_to_c(32) == 0", "f_to_c(212) == 100"],
    ["Multiply Elements", "Return the product of all elements in the array.", "product_array(arr)", "product_array([1,2,3,4]) == 24", "product_array([1,0,5]) == 0"],
    ["Count Occurrences", "Return the number of times target appears in arr.", "count_target(arr, target)", "count_target([1,2,2,3], 2) == 2", "count_target([1,1], 3) == 0"],
    ["Absolute Difference", "Return the absolute difference between a and b.", "abs_diff(a, b)", "abs_diff(5, 10) == 5", "abs_diff(10, 5) == 5"],
    ["Is Divisible", "Return True if a is divisible by b, False otherwise.", "is_divisible(a, b)", "is_divisible(10, 2) == True", "is_divisible(10, 3) == False"],
    ["String to Int", "Convert string to integer.", "str_to_int(s)", "str_to_int('123') == 123", "str_to_int('-5') == -5"],
    ["Int to String", "Convert integer to string.", "int_to_str(n)", "int_to_str(123) == '123'", "int_to_str(-5) == '-5'"],
    ["Swap Ends", "Swap the first and last elements of an array and return it.", "swap_ends(arr)", "swap_ends([1,2,3]) == [3,2,1]", "swap_ends([1]) == [1]"],
    ["Middle Element", "Return the middle element of an array. If even length, return the right middle.", "middle(arr)", "middle([1,2,3]) == 2", "middle([1,2,3,4]) == 3"],
    ["All Unique", "Return True if all elements in the array are unique.", "all_unique(arr)", "all_unique([1,2,3]) == True", "all_unique([1,2,1]) == False"],
    ["Contains Substring", "Return True if sub is present in s.", "contains_sub(s, sub)", "contains_sub('hello', 'ell') == True", "contains_sub('hello', 'world') == False"],
    ["Nth Multiple", "Return the nth multiple of m.", "nth_multiple(n, m)", "nth_multiple(3, 5) == 15", "nth_multiple(1, 10) == 10"],
    ["Count Evens", "Return the number of even numbers in an array.", "count_evens(arr)", "count_evens([1,2,3,4]) == 2", "count_evens([1,3,5]) == 0"],
    ["Count Odds", "Return the number of odd numbers in an array.", "count_odds(arr)", "count_odds([1,2,3,4]) == 2", "count_odds([2,4,6]) == 0"],
    ["Is Empty", "Return True if the array/string is empty.", "is_empty(item)", "is_empty('') == True", "is_empty([1]) == False"],
    ["Repeat String", "Return the string repeated n times.", "repeat_str(s, n)", "repeat_str('a', 3) == 'aaa'", "repeat_str('xyz', 2) == 'xyzxyz'"],
    ["Add One", "Add 1 to the given number.", "add_one(n)", "add_one(5) == 6", "add_one(-1) == 0"],
    ["Double", "Return the number multiplied by 2.", "double_n(n)", "double_n(4) == 8", "double_n(0) == 0"]
];

const mediumData = [
    ["Reverse Int Overflow", "Reverse the digits of a signed integer. Return 0 if it overflows.", "reverse_int(x)", "reverse_int(123) == 321", "reverse_int(-123) == -321"],
    ["Group Anagrams", "Group an array of strings into anagrams.", "group_anagrams(strs)", "sorted([sorted(x) for x in group_anagrams(['eat','tea','tan','ate','nat','bat'])]) == sorted([sorted(['eat','tea','ate']), sorted(['tan','nat']), sorted(['bat'])])", "group_anagrams(['']) == [['']]"],
    ["Valid Parentheses", "Given a string of '()', '{}', '[]', return True if closed properly.", "is_valid_brackets(s)", "is_valid_brackets('()[]{}') == True", "is_valid_brackets('([)]') == False"],
    ["Rotate Array", "Rotate an array to the right by k steps. Return the rotated array.", "rotate_arr(arr, k)", "rotate_arr([1,2,3,4,5,6,7], 3) == [5,6,7,1,2,3,4]", "rotate_arr([-1,-100,3,99], 2) == [3,99,-1,-100]"],
    ["Find Peak Element", "Find a peak element in an array and return its index.", "find_peak(arr)", "find_peak([1,2,3,1]) == 2", "find_peak([1]) == 0"],
    ["Sort Colors", "Given an array of 0s, 1s, and 2s, sort them in-place and return the array.", "sort_colors(arr)", "sort_colors([2,0,2,1,1,0]) == [0,0,1,1,2,2]", "sort_colors([2,0,1]) == [0,1,2]"],
    ["Kth Largest", "Find the kth largest element in an array.", "kth_largest(arr, k)", "kth_largest([3,2,1,5,6,4], 2) == 5", "kth_largest([3,2,3,1,2,4,5,5,6], 4) == 4"],
    ["Top K Frequent Elements", "Return the k most frequent elements in an array. Sorted in ascending order for the output.", "top_k(arr, k)", "sorted(top_k([1,1,1,2,2,3], 2)) == [1,2]", "top_k([1], 1) == [1]"],
    ["Longest Unique Substring", "Find the length of the longest substring without repeating characters.", "longest_unique_sub(s)", "longest_unique_sub('abcabcbb') == 3", "longest_unique_sub('bbbbb') == 1"],
    ["Container With Most Water", "Find two lines that together with x-axis form a container, such that the container contains the most water.", "max_area(heights)", "max_area([1,8,6,2,5,4,8,3,7]) == 49", "max_area([1,1]) == 1"],
    ["Spiral Matrix", "Given an m x n matrix, return all elements in spiral order.", "spiral(matrix)", "spiral([[1,2,3],[4,5,6],[7,8,9]]) == [1,2,3,6,9,8,7,4,5]", "spiral([[1]]) == [1]"],
    ["Coin Change", "Return the fewest number of coins to make up an amount, or -1 if impossible.", "coin_change(coins, amount)", "coin_change([1,2,5], 11) == 3", "coin_change([2], 3) == -1"],
    ["Jump Game", "Return True if you can reach the last index of the array, False otherwise.", "can_jump(arr)", "can_jump([2,3,1,1,4]) == True", "can_jump([3,2,1,0,4]) == False"],
    ["Merge Intervals", "Merge all overlapping intervals. List of lists [start, end].", "merge_intervals(intervals)", "merge_intervals([[1,3],[2,6],[8,10],[15,18]]) == [[1,6],[8,10],[15,18]]", "merge_intervals([[1,4],[4,5]]) == [[1,5]]"],
    ["Search in Rotated Array", "Find target in a rotated sorted array. Return index or -1.", "search_rotated(arr, target)", "search_rotated([4,5,6,7,0,1,2], 0) == 4", "search_rotated([4,5,6,7,0,1,2], 3) == -1"],
    ["Longest Increasing Subsequence", "Return the length of the longest strictly increasing subsequence.", "length_of_lis(arr)", "length_of_lis([10,9,2,5,3,7,101,18]) == 4", "length_of_lis([7,7,7,7]) == 1"],
    ["House Robber", "Determine max money you can rob without robbing adjacent houses.", "rob(nums)", "rob([1,2,3,1]) == 4", "rob([2,7,9,3,1]) == 12"],
    ["Word Break", "Return True if s can be segmented into a sequence of dictionary words.", "word_break(s, wordDict)", "word_break('leetcode', ['leet','code']) == True", "word_break('catsandog', ['cats','dog','sand','and','cat']) == False"],
    ["Set Matrix Zeroes", "If an element is 0, set its entire row and column to 0. Return modified.", "set_zeroes(matrix)", "set_zeroes([[1,1,1],[1,0,1],[1,1,1]]) == [[1,0,1],[0,0,0],[1,0,1]]", "set_zeroes([[0,1,2,0],[3,4,5,2],[1,3,1,5]]) == [[0,0,0,0],[0,4,5,0],[0,3,1,0]]"],
    ["Permutations", "Return all possible permutations of an array of distinct integers.", "permute(nums)", "sorted(permute([1,2])) == [[1,2],[2,1]]", "permute([1]) == [[1]]"],
    ["Product Except Self", "Return answer where answer[i] is product of all elements except nums[i].", "product_except_self(nums)", "product_except_self([1,2,3,4]) == [24,12,8,6]", "product_except_self([-1,1,0,-3,3]) == [0,0,9,0,0]"],
    ["Find Duplicate Number", "Given an array of size n+1 with integers in [1,n], return the one repeated number.", "find_duplicate(nums)", "find_duplicate([1,3,4,2,2]) == 2", "find_duplicate([3,1,3,4,2]) == 3"],
    ["Subarray Sum K", "Return the total number of continuous subarrays whose sum equals k.", "subarray_sum(nums, k)", "subarray_sum([1,1,1], 2) == 2", "subarray_sum([1,2,3], 3) == 2"],
    ["LRU End State", "Given queries (add item, return list), return the final state sorted.", "lru_sequence(queries, cap)", "lru_sequence([1,2,3,4], 2) == [3,4]", "lru_sequence([1,2,1,3], 2) == [1,3]"],
    ["Max Product Subarray", "Find the contiguous subarray with the largest product.", "max_product(nums)", "max_product([2,3,-2,4]) == 6", "max_product([-2,0,-1]) == 0"]
];

const hardData = [
    ["First Missing Positive", "Return the smallest missing positive integer in an unsorted array.", "first_missing_pos(nums)", "first_missing_pos([1,2,0]) == 3", "first_missing_pos([3,4,-1,1]) == 2"],
    ["Trapping Rain Water", "Given n non-negative integers representing an elevation map, compute how much water it can trap.", "trap(heights)", "trap([0,1,0,2,1,0,1,3,2,1,2,1]) == 6", "trap([4,2,0,3,2,5]) == 9"],
    ["Median of Two Sorted Arrays", "Return the median of the two sorted arrays.", "find_median(nums1, nums2)", "find_median([1,3], [2]) == 2.0", "find_median([1,2], [3,4]) == 2.5"],
    ["Longest Valid Parentheses", "Find the length of the longest valid well-formed parentheses substring.", "longest_valid(s)", "longest_valid('(()') == 2", "longest_valid(')()())') == 4"],
    ["Wildcard Matching", "Implement wildcard pattern matching with '?' and '*'.", "is_match(s, p)", "is_match('aa', 'a') == False", "is_match('aa', '*') == True"],
    ["Jump Game II", "Return the minimum number of jumps to reach the last index.", "jump(nums)", "jump([2,3,1,1,4]) == 2", "jump([2,3,0,1,4]) == 2"],
    ["N-Queens", "Return the number of distinct solutions to the n-queens puzzle.", "total_n_queens(n)", "total_n_queens(4) == 2", "total_n_queens(1) == 1"],
    ["Minimum Window Substring", "Return the min window substring of s such that every character in t is included.", "min_window(s, t)", "min_window('ADOBECODEBANC', 'ABC') == 'BANC'", "min_window('a', 'a') == 'a'"],
    ["Largest Rectangle in Histogram", "Find the area of largest rectangle in the histogram.", "largest_rectangle(heights)", "largest_rectangle([2,1,5,6,2,3]) == 10", "largest_rectangle([2,4]) == 4"],
    ["Edit Distance", "Return min operations to convert word1 to word2.", "min_distance(word1, word2)", "min_distance('horse', 'ros') == 3", "min_distance('intention', 'execution') == 5"],
    ["Scramble String", "Determine if s2 is a scrambled string of s1.", "is_scramble(s1, s2)", "is_scramble('great', 'rgeat') == True", "is_scramble('abcde', 'caebd') == False"],
    ["Distinct Subsequences", "Return the number of distinct subsequences of s which equals t.", "num_distinct(s, t)", "num_distinct('rabbbit', 'rabbit') == 3", "num_distinct('babgbag', 'bag') == 5"],
    ["Word Ladder Length", "Return length of shortest transformation sequence.", "ladder_length(beginWord, endWord, wordList)", "ladder_length('hit', 'cog', ['hot','dot','dog','lot','log','cog']) == 5", "ladder_length('hit', 'cog', ['hot','dot','dog','lot','log']) == 0"],
    ["Candy", "Return min candies to distribute based on ratings.", "candy(ratings)", "candy([1,0,2]) == 5", "candy([1,2,2]) == 4"],
    ["Sliding Window Maximum", "Return the max sliding window array of size k.", "max_sliding_window(nums, k)", "max_sliding_window([1,3,-1,-3,5,3,6,7], 3) == [3,3,5,5,6,7]", "max_sliding_window([1], 1) == [1]"],
    ["Find Min Rotated II", "Find min element in rotated array that may contain duplicates.", "find_min_rot(nums)", "find_min_rot([1,3,5]) == 1", "find_min_rot([2,2,2,0,1]) == 0"],
    ["Dungeon Game", "Return knight's min initial health to rescue princess.", "calculate_min_hp(dungeon)", "calculate_min_hp([[-2,-3,3],[-5,-10,1],[10,30,-5]]) == 7", "calculate_min_hp([[0]]) == 1"],
    ["Max Points on a Line", "Given an array of points, return the maximum number of points on same line.", "max_points(points)", "max_points([[1,1],[2,2],[3,3]]) == 3", "max_points([[1,1],[3,2],[5,3],[4,1],[2,3],[1,4]]) == 4"],
    ["Regular Expression", "Implement regex matching with '.' and '*'.", "is_regex_match(s, p)", "is_regex_match('aa', 'a') == False", "is_regex_match('ab', '.*') == True"],
    ["Merge k Sorted Lists", "Merge k sorted arrays into one sorted array.", "merge_k_arrays(lists)", "merge_k_arrays([[1,4,5],[1,3,4],[2,6]]) == [1,1,2,3,4,4,5,6]", "merge_k_arrays([]) == []"],
    ["Reverse Nodes in k-Group", "Reverse elements of array k at a time.", "reverse_k_group(arr, k)", "reverse_k_group([1,2,3,4,5], 2) == [2,1,4,3,5]", "reverse_k_group([1,2,3,4,5], 3) == [3,2,1,4,5]"],
    ["Substring with Concatenation", "Find starting indices of substrings that are a concatenation of all words.", "find_substring(s, words)", "find_substring('barfoothefoobarman', ['foo','bar']) == [0,9]", "find_substring('wordgoodgoodgoodbestword', ['word','good','best','word']) == []"],
    ["Sudoku Valid Row", "Given an array of 9 strings, return True if valid sudoku row.", "valid_row(row)", "valid_row(['5','3','.','.','7','.','.','.','.']) == True", "valid_row(['5','5','.','.','7','.','.','.','.']) == False"],
    ["Largest Divisible Subset", "Find largest subset where every pair is mutually divisible (return its size).", "largest_divisible(nums)", "largest_divisible([1,2,3]) == 2", "largest_divisible([1,2,4,8]) == 4"],
    ["Perfect Squares", "Return least number of perfect square numbers that sum to n.", "num_squares(n)", "num_squares(12) == 3", "num_squares(13) == 2"]
];

function buildQuestion(diff, item) {
    const [title, desc, template, t1, t2] = item;
    const body = `assert ${t1}
assert ${t2}
print("Passed")`;

    // Parse the assert string roughly to format it beautifully as an example
    const formatExample = (teststr, index) => {
        const parts = teststr.split(' == ');
        if (parts.length < 2) return `<strong>Example ${index}:</strong><br>Test: ${teststr}<br><br>`;
        return `<strong>Example ${index}:</strong><br>Input: <code>${parts[0]}</code><br>Output: <code>${parts[1]}</code><br><br>`;
    };

    let genExamples = formatExample(t1, 1) + formatExample(t2, 2);

    return {
        title: title,
        difficulty: diff,
        desc: desc,
        examples: genExamples,
        template: `def ${template}:\n    pass`,
        validation: body
    };
}

const allQuestions = {
    "Easy": easyData.map(d => buildQuestion("Easy", d)),
    "Medium": mediumData.map(d => buildQuestion("Medium", d)),
    "Hard": hardData.map(d => buildQuestion("Hard", d))
};

fs.writeFileSync('questions.json', JSON.stringify(allQuestions, null, 2));
console.log("Successfully generated highly distinct questions.json.");
