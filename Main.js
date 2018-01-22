var optiMAL = require('./optiMAL')

//(1)単純な使い方
console.time("optiMAL1")
var m = optiMAL(global)
m.load("./core.json")
m.xyz = 33
m.EVAL('(+ 22 xyz)', true)
m.EVAL('(prn (+ 22 44))', false)
console.timeEnd("optiMAL1")

//(2)Scheme互換レイヤーを作ってみる
console.time("optiMAL2")
var m = optiMAL(global)
m.load("./core.json")
m['%'] = (a, b)=>a%b
m.EVAL(
`(def define (~ (fn ($first & $rest)
  (let ($exp)
    (if (list? $first)
        (concat (list 'def (first $first) (concat (list 'fn (rest $first)) $rest)))
      (concat (list 'def $first) $rest))))))
(def cond:builder (fn ($list)
  (if (empty? $list)
      #nil
    (let ($top (. $list "shift"))
      (if (= (nth $top 0) 'else)
          (nth $top 1)
        (list 'if (nth $top 0)
            (nth $top 1)
          (cond:builder $list)))))))
(def cond (~ (fn (& $rest)
  (cond:builder $rest))))`)
m.DEMO(
`(define (fib n)
  (if (< n 2)
      n
      (+ (fib (- n 1))
         (fib (- n 2)))))`)
m.DEMO(`(fib 1) (fib 2) (fib 3) (fib 4) (fib 5) (fib 6)`) // https://matome.naver.jp/odai/2146866504646122901
m.DEMO(
` ; https://qiita.com/shuetsu@github/items/570cb1319d808146913d 1.2.6 素数判定
(define (square x) (* x x)) ;; ADD
(define (remainder x y) (% x y)) ;; ADD
(define (smallest-divisor n) (find-divisor n 2))
(define (find-divisor n test-divisor)
  (cond ((> (square test-divisor) n) n)
        ((divisor? test-divisor n) test-divisor)
        (else (find-divisor n (+ test-divisor 1)))))
(define (divisor? a b) (= (remainder b a) 0))
(define (prime? n)
  (= n (smallest-divisor n)))
(smallest-divisor 199)
(smallest-divisor 1999)
(smallest-divisor 19999)
(smallest-divisor 1)
(smallest-divisor 2)
(smallest-divisor 3)
(smallest-divisor 4)
(smallest-divisor 120)
`)
console.timeEnd("optiMAL2")
