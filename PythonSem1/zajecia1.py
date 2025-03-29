def greet_user(name):
    print(f"Hello, {name}!")

def main():
    print("Hello from zajecia1!")

def zad1(x,y):
    return x*y

def zad2(liczba):
    return liczba%2==0

def zad3(limit):
    sum_of_squares = sum(number ** 2 for number in range(1, limit))
    return sum_of_squares

def zad4(liczba):
    if liczba < 2:
        return False
    for i in range(2, int(liczba ** 0.5) + 1):
        if liczba % i == 0:
            return False
    return True

def zad5(n):
    divisors = [i for i in range(1, n + 1) if n % i == 0]
    return divisors

def zad6(n):
        factors = []
        divisor = 2
        while n > 1:
            while n % divisor == 0:
                factors.append(divisor)
                n //= divisor
            divisor += 1
            if divisor * divisor > n and n > 1:
                factors.append(n)
                break
        return factors

def zad7(a, b):
            def gcd(x, y):
                while y:
                    x, y = y, x % y
                return x

            return abs(a * b) // gcd(a, b)

def zad8(n):
            return bin(n)[2:]

def zad9(a, b, c):
                discriminant = b**2 - 4*a*c
                if discriminant > 0:
                    root1 = (-b + discriminant**0.5) / (2*a)
                    root2 = (-b - discriminant**0.5) / (2*a)
                    return root1, root2
                elif discriminant == 0:
                    root = -b / (2*a)
                    return root,
                else:
                    return None            

def zad10_iterative(n):
    """Oblicza n! metodą iteracyjną."""
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result

def zad10_recursive(n):
    """Oblicza n! metodą rekurencyjną."""
    if n <= 1:
        return 1
    return n * zad10_recursive(n - 1)

# Możesz używać jednej z poniższych wersji, tutaj przyjmujemy iteracyjną jako domyślną.
def zad10(n):
    return zad10_iterative(n)


def zad11(n):
    """
    Oblicza n-tą liczbę Fibonacciego (przyjmując, że F(0)=0, F(1)=1).
    Metoda iteracyjna, efektywna dla dużych n.
    """
    if n < 0:
        raise ValueError("n musi być nieujemne")
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a


def zad12(*args):
    """
    Dla dowolnej ilości argumentów zwraca listę skumulowanych sum częściowych.
    Przykład: zad12(1, 2, 3) -> [1, 3, 6]
    """
    cum_sum = 0
    result = []
    for num in args:
        cum_sum += num
        result.append(cum_sum)
    return result


def zad13(*args):
    """
    Dla dowolnej ilości argumentów liczbowych zwraca ich średnią arytmetyczną.
    Jeśli nie podano argumentów, zwraca 0.
    """
    if len(args) == 0:
        return 0
    return sum(args) / len(args)


def zad14(s):
    """
    Dla zadanego łańcucha znaków zwraca łańcuch ze znakami w odwrotnej kolejności.
    """
    return s[::-1]


def zad15(s):
    """
    Dla danego łańcucha znaków zwraca słownik z liczbą dużych i małych liter.
    Klucze: 'upper' i 'lower'.
    """
    upper_count = sum(1 for char in s if char.isupper())
    lower_count = sum(1 for char in s if char.islower())
    return {"upper": upper_count, "lower": lower_count}


def zad16(lst):
    """
    Dla danej listy zwraca listę unikalnych elementów, zachowując kolejność.
    """
    unique = []
    for item in lst:
        if item not in unique:
            unique.append(item)
    return unique


def zad17(s):
    """
    Dla zadanego łańcucha znaków zwraca słownik ze statystyką częstości występowania poszczególnych znaków.
    """
    freq = {}
    for char in s:
        freq[char] = freq.get(char, 0) + 1
    return freq


def zad18(s):
    """
    Dla zadanego stringa zwraca listę słów, na które można go podzielić.
    """
    return s.split()


def zad19(s):
    """
    Dla zadanego łańcucha znaków zwraca jego postać w notacji wielbłądziej (camelCase).
    Przykład: "ala ma pythona" -> "alaMaPythona"
    """
    words = s.split()
    if not words:
        return ""
    return words[0].lower() + "".join(word.capitalize() for word in words[1:])


def zad20(s):
    """
    Dla stringa w notacji wielbłądziej (camelCase) zwraca jego postać "normalną" (wszystkie litery małe, oddzielone spacjami).
    Przykład: "alaMaPythona" -> "ala ma pythona"
    """
    result = ""
    for char in s:
        if char.isupper():
            result += " " + char.lower()
        else:
            result += char
    return result.strip()


def zad21(n, tolerance=1e-10, max_iterations=1000):
    """
    Oblicza przybliżenie pierwiastka kwadratowego liczby n metodą babilońską (Herona).
    """
    if n < 0:
        raise ValueError("n musi być nieujemne")
    if n == 0:
        return 0
    x = n
    for _ in range(max_iterations):
        root = 0.5 * (x + n / x)
        if abs(root - x) < tolerance:
            break
        x = root
    return x


import random
def zad22(iterations):
    """
    Przybliża wartość π metodą Monte-Carlo.
    iterations - liczba losowań (im większa, tym dokładniejsze przybliżenie).
    """
    inside = 0
    for _ in range(iterations):
        x = random.random()
        y = random.random()
        if x*x + y*y <= 1:
            inside += 1
    return (inside / iterations) * 4


def zad23(a, b):
    """
    Dla podanych list a i b zwraca listę krotek, gdzie każda krotka to para elementów z obu list o tym samym indeksie.
    Przykład: a = [1,2,3], b = [4,5,6] -> [(1,4), (2,5), (3,6)]
    """
    return list(zip(a, b))


def zad24():
    """
    Dla zakresu liczb od 0 do 99 zwraca listę tych wartości, które są podzielne przez 3 i jednocześnie niepodzielne przez 5.
    """
    return [x for x in range(100) if x % 3 == 0 and x % 5 != 0]







if __name__ == "__main__":
    main()
    greet_user("Student")
    print(zad1(3,4))
    print("Czy parzysta: " + str(zad2(9)))


