const fs = require('fs');

const easyData = [
    ["Two Sum", "Given an array of integers nums, return a dynamic array of two indices such that their elements add up to target.", "int* two_sum(int* nums, int numsSize, int target)", "eq_arr(two_sum((int[]){2,7,11,15}, 4, 9), (int[]){0, 1}, 2)", "eq_arr(two_sum((int[]){3,2,4}, 3, 6), (int[]){1, 2}, 2)"],
    ["Palindrome Number", "Given an integer x, return true if x is a palindrome, and false otherwise.", "bool is_palindrome(int x)", "is_palindrome(121) == true", "is_palindrome(-121) == false"],
    ["Reverse String", "Write a function that reverses a string.", "char* reverse_string(char* s)", "eq_str(reverse_string(strdup(\"hello\")), \"olleh\")", "eq_str(reverse_string(strdup(\"abcd\")), \"dcba\")"],
    ["Sum Array", "Return the sum of all elements in an array.", "int sum_array(int* arr, int size)", "sum_array((int[]){1,2,3}, 3) == 6", "sum_array((int[]){-1, 1}, 2) == 0"],
    ["Find Maximum", "Return the largest number in the array.", "int find_max(int* arr, int size)", "find_max((int[]){1,5,3}, 3) == 5", "find_max((int[]){-10,-5}, 2) == -5"],
    ["Find Minimum", "Return the smallest number in the array.", "int find_min(int* arr, int size)", "find_min((int[]){1,5,3}, 3) == 1", "find_min((int[]){-10,-5}, 2) == -10"],
    ["Count Vowels", "Count the number of vowels (a,e,i,o,u) in a string.", "int count_vowels(const char* s)", "count_vowels(\"hello\") == 2", "count_vowels(\"apple\") == 2"],
    ["Is Even", "Return True if n is even, False otherwise.", "bool is_even(int n)", "is_even(4) == true", "is_even(7) == false"],
    ["Is Odd", "Return True if n is odd, False otherwise.", "bool is_odd(int n)", "is_odd(5) == true", "is_odd(2) == false"],
    ["Factorial", "Return the factorial of n.", "int factorial(int n)", "factorial(5) == 120", "factorial(3) == 6"],
    ["Fibonacci", "Return the n-th Fibonacci number (n=0 returns 0, n=1 returns 1).", "int fibonacci(int n)", "fibonacci(5) == 5", "fibonacci(7) == 13"],
    ["GCD", "Return the greatest common divisor of a and b.", "int gcd(int a, int b)", "gcd(12, 8) == 4", "gcd(7, 3) == 1"],
    ["Check Prime", "Return True if n is a prime number, False otherwise.", "bool is_prime(int n)", "is_prime(7) == true", "is_prime(10) == false"],
    ["Sum of Digits", "Return the sum of the digits of a positive integer n.", "int sum_digits(int n)", "sum_digits(123) == 6", "sum_digits(405) == 9"],
    ["Reverse Digits", "Reverse the digits of a number. (Assume positive)", "int reverse_digits(int n)", "reverse_digits(123) == 321", "reverse_digits(400) == 4"],
    ["Count Set Bits", "Count the number of 1s in the binary representation of n.", "int count_bits(int n)", "count_bits(5) == 2", "count_bits(7) == 3"],
    ["FizzBuzz", "Return 'Fizz' if n is divisible by 3, 'Buzz' if by 5, 'FizzBuzz' if both, else return a string representation of n.", "char* fizz_buzz(int n)", "eq_str(fizz_buzz(15), \"FizzBuzz\")", "eq_str(fizz_buzz(3), \"Fizz\")"],
    ["Leap Year", "Return True if year is a leap year, False otherwise.", "bool is_leap(int year)", "is_leap(2020) == true", "is_leap(2021) == false"],
    ["String Length", "Return the length of the string.", "int string_len(const char* s)", "string_len(\"hello\") == 5", "string_len(\"\") == 0"],
    ["Count Consonants", "Count consonants in a string (letters that are not vowels).", "int count_consonants(const char* s)", "count_consonants(\"hello\") == 3", "count_consonants(\"world\") == 4"],
    ["Square Root", "Return the integer part of the square root of n.", "int int_sqrt(int n)", "int_sqrt(9) == 3", "int_sqrt(15) == 3"],
    ["Power of Two", "Return True if n is a power of two, False otherwise.", "bool is_power_of_two(int n)", "is_power_of_two(16) == true", "is_power_of_two(14) == false"],
    ["Remove Spaces", "Return a new string with all spaces removed.", "char* remove_spaces(const char* s)", "eq_str(remove_spaces(\"a b c\"), \"abc\")", "eq_str(remove_spaces(\" x \"), \"x\")"],
    ["Anagram Check", "Return True if s1 is an anagram of s2.", "bool is_anagram(const char* s1, const char* s2)", "is_anagram(\"listen\", \"silent\") == true", "is_anagram(\"hello\", \"world\") == false"],
    ["First Element", "Return the first element of the array. If empty, return -1.", "int first_element(int* arr, int size)", "first_element((int[]){5,2}, 2) == 5", "first_element(NULL, 0) == -1"],
    ["Last Element", "Return the last element of the array. If empty, return -1.", "int last_element(int* arr, int size)", "last_element((int[]){5,2}, 2) == 2", "last_element(NULL, 0) == -1"],
    ["Average", "Return the average of the array of numbers. If empty, return 0.", "double average(int* arr, int size)", "average((int[]){1,2,3}, 3) == 2.0", "average(NULL, 0) == 0"],
    ["Celsius to Fahrenheit", "Convert Celsius temperature to Fahrenheit (F = C * 9/5 + 32).", "int c_to_f(int c)", "c_to_f(0) == 32", "c_to_f(100) == 212"],
    ["Fahrenheit to Celsius", "Convert Fahrenheit to Celsius (C = (F - 32) * 5/9).", "int f_to_c(int f)", "f_to_c(32) == 0", "f_to_c(212) == 100"],
    ["Multiply Elements", "Return the product of all elements in the array.", "int product_array(int* arr, int size)", "product_array((int[]){1,2,3,4}, 4) == 24", "product_array((int[]){1,0,5}, 3) == 0"],
    ["Count Occurrences", "Return the number of times target appears in arr.", "int count_target(int* arr, int size, int target)", "count_target((int[]){1,2,2,3}, 4, 2) == 2", "count_target((int[]){1,1}, 2, 3) == 0"],
    ["Absolute Difference", "Return the absolute difference between a and b.", "int abs_diff(int a, int b)", "abs_diff(5, 10) == 5", "abs_diff(10, 5) == 5"],
    ["Is Divisible", "Return True if a is divisible by b, False otherwise.", "bool is_divisible(int a, int b)", "is_divisible(10, 2) == true", "is_divisible(10, 3) == false"],
    ["String to Int", "Convert string to integer.", "int str_to_int(const char* s)", "str_to_int(\"123\") == 123", "str_to_int(\"-5\") == -5"],
    ["Int to String", "Convert integer to string (dynamically allocated).", "char* int_to_str(int n)", "eq_str(int_to_str(123), \"123\")", "eq_str(int_to_str(-5), \"-5\")"],
    ["Count Evens", "Return the number of even numbers in an array.", "int count_evens(int* arr, int size)", "count_evens((int[]){1,2,3,4}, 4) == 2", "count_evens((int[]){1,3,5}, 3) == 0"],
    ["Count Odds", "Return the number of odd numbers in an array.", "int count_odds(int* arr, int size)", "count_odds((int[]){1,2,3,4}, 4) == 2", "count_odds((int[]){2,4,6}, 3) == 0"],
    ["Add One", "Add 1 to the given number.", "int add_one(int n)", "add_one(5) == 6", "add_one(-1) == 0"],
    ["Double", "Return the number multiplied by 2.", "int double_n(int n)", "double_n(4) == 8", "double_n(0) == 0"],
    ["Contains Substring", "Return True if sub is present in s.", "bool contains_sub(const char* s, const char* sub)", "contains_sub(\"hello\", \"ell\") == true", "contains_sub(\"hello\", \"world\") == false"]
];

const mediumData = [
    ["Reverse Int", "Reverse the digits of a signed integer. (Return 0 on overflow normally, here assume standard 32-bit)", "int reverse_int(int x)", "reverse_int(123) == 321", "reverse_int(-123) == -321"],
    ["Valid Parentheses", "Given a string of '()', '{}', '[]', return True if closed properly.", "bool is_valid_brackets(const char* s)", "is_valid_brackets(\"()[]{}\") == true", "is_valid_brackets(\"([)]\") == false"],
    ["Find Peak Element", "Find a peak element in an array and return its index.", "int find_peak(int* arr, int size)", "find_peak((int[]){1,2,3,1}, 4) == 2", "find_peak((int[]){1}, 1) == 0"],
    ["Sort Colors", "Given an array of 0s, 1s, and 2s, sort them in-place.", "void sort_colors(int* arr, int size)", "({ int temp[] = {2,0,2,1,1,0}; sort_colors(temp, 6); eq_arr(temp, (int[]){0,0,1,1,2,2}, 6); })", "({ int temp[] = {2,0,1}; sort_colors(temp, 3); eq_arr(temp, (int[]){0,1,2}, 3); })"],
    ["Kth Largest", "Find the kth largest element in an array.", "int kth_largest(int* arr, int size, int k)", "kth_largest((int[]){3,2,1,5,6,4}, 6, 2) == 5", "kth_largest((int[]){3,2,3,1,2,4,5,5,6}, 9, 4) == 4"],
    ["Longest Unique Substring", "Find the length of the longest substring without repeating characters.", "int longest_unique_sub(const char* s)", "longest_unique_sub(\"abcabcbb\") == 3", "longest_unique_sub(\"bbbbb\") == 1"],
    ["Container With Most Water", "Find max area.", "int max_area(int* heights, int size)", "max_area((int[]){1,8,6,2,5,4,8,3,7}, 9) == 49", "max_area((int[]){1,1}, 2) == 1"],
    ["Coin Change", "Return the fewest number of coins to make up an amount, or -1 if impossible.", "int coin_change(int* coins, int size, int amount)", "coin_change((int[]){1,2,5}, 3, 11) == 3", "coin_change((int[]){2}, 1, 3) == -1"],
    ["Jump Game", "Return True if you can reach the last index of the array, False otherwise.", "bool can_jump(int* arr, int size)", "can_jump((int[]){2,3,1,1,4}, 5) == true", "can_jump((int[]){3,2,1,0,4}, 5) == false"],
    ["Search in Rotated Array", "Find target in a rotated sorted array. Return index or -1.", "int search_rotated(int* arr, int size, int target)", "search_rotated((int[]){4,5,6,7,0,1,2}, 7, 0) == 4", "search_rotated((int[]){4,5,6,7,0,1,2}, 7, 3) == -1"],
    ["Longest Increasing Subsequence", "Return the length of the longest strictly increasing subsequence.", "int length_of_lis(int* arr, int size)", "length_of_lis((int[]){10,9,2,5,3,7,101,18}, 8) == 4", "length_of_lis((int[]){7,7,7,7}, 4) == 1"],
    ["House Robber", "Determine max money you can rob without robbing adjacent houses.", "int rob(int* nums, int size)", "rob((int[]){1,2,3,1}, 4) == 4", "rob((int[]){2,7,9,3,1}, 5) == 12"],
    ["Find Duplicate Number", "Given an array of size n+1 with integers in [1,n], return the one repeated number.", "int find_duplicate(int* nums, int size)", "find_duplicate((int[]){1,3,4,2,2}, 5) == 2", "find_duplicate((int[]){3,1,3,4,2}, 5) == 3"],
    ["Subarray Sum K", "Return the total number of continuous subarrays whose sum equals k.", "int subarray_sum(int* nums, int size, int k)", "subarray_sum((int[]){1,1,1}, 3, 2) == 2", "subarray_sum((int[]){1,2,3}, 3, 3) == 2"],
    ["Max Product Subarray", "Find the contiguous subarray with the largest product.", "int max_product(int* nums, int size)", "max_product((int[]){2,3,-2,4}, 4) == 6", "max_product((int[]){-2,0,-1}, 3) == 0"]
];

const hardData = [
    ["First Missing Positive", "Return the smallest missing positive integer in an unsorted array.", "int first_missing_pos(int* nums, int size)", "first_missing_pos((int[]){1,2,0}, 3) == 3", "first_missing_pos((int[]){3,4,-1,1}, 4) == 2"],
    ["Trapping Rain Water", "Given n non-negative integers representing an elevation map.", "int trap(int* heights, int size)", "trap((int[]){0,1,0,2,1,0,1,3,2,1,2,1}, 12) == 6", "trap((int[]){4,2,0,3,2,5}, 6) == 9"],
    ["Longest Valid Parentheses", "Find the length of the longest valid well-formed parentheses substring.", "int longest_valid(const char* s)", "longest_valid(\"(()\") == 2", "longest_valid(\")()())\") == 4"],
    ["Wildcard Matching", "Implement wildcard pattern matching with '?' and '*'.", "bool is_match(const char* s, const char* p)", "is_match(\"aa\", \"a\") == false", "is_match(\"aa\", \"*\") == true"],
    ["Jump Game II", "Return the minimum number of jumps to reach the last index.", "int jump(int* nums, int size)", "jump((int[]){2,3,1,1,4}, 5) == 2", "jump((int[]){2,3,0,1,4}, 5) == 2"],
    ["Edit Distance", "Return min operations to convert word1 to word2.", "int min_distance(const char* word1, const char* word2)", "min_distance(\"horse\", \"ros\") == 3", "min_distance(\"intention\", \"execution\") == 5"],
    ["Distinct Subsequences", "Return the number of distinct subsequences of s which equals t.", "int num_distinct(const char* s, const char* t)", "num_distinct(\"rabbbit\", \"rabbit\") == 3", "num_distinct(\"babgbag\", \"bag\") == 5"],
    ["Candy", "Return min candies to distribute based on ratings.", "int candy(int* ratings, int size)", "candy((int[]){1,0,2}, 3) == 5", "candy((int[]){1,2,2}, 3) == 4"]
];

function buildQuestion(diff, item) {
    const [title, desc, template, t1, t2] = item;

    // C Validation Boilerplate
    const body = `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <assert.h>
#include <math.h>

// Helper Macros for C assertions
#define eq_str(a, b) (strcmp(a, b) == 0)
#define eq_arr(a, b, len) ({ bool _res = true; for(int _i=0; _i<len; _i++) { if((a)[_i] != (b)[_i]) { _res = false; break; } } _res; })

// -- USER CODE INJECTED HERE --

int main() {
    assert(${t1});
    assert(${t2});
    printf("Passed\\n");
    return 0;
}`;

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
        template: `${template} {\n    // Write your pure C code here\n    \n}`,
        validation: body
    };
}

const allQuestions = {
    "Easy": easyData.map(d => buildQuestion("Easy", d)),
    "Medium": mediumData.map(d => buildQuestion("Medium", d)),
    "Hard": hardData.map(d => buildQuestion("Hard", d))
};

fs.writeFileSync('questions_c.json', JSON.stringify(allQuestions, null, 2));
console.log("Successfully generated C questions_c.json.");
