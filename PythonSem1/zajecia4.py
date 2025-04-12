
import numpy as np
import math
import random
from timeit import timeit

# ---------- ZADANIE 1 ----------
def szyfr_cezara(plik_wejsciowy, plik_wyjsciowy, klucz):
    with open(plik_wejsciowy, 'r', encoding='utf-8') as f:
        tekst = f.read()
    zaszyfrowany = ''.join(chr((ord(znak) + klucz) % 256) for znak in tekst)
    with open(plik_wyjsciowy, 'w', encoding='utf-8') as f:
        f.write(zaszyfrowany)

# ---------- ZADANIE 2 ----------
def sinus_math():
    return [math.sin(i) for i in range(10**6)]

def sinus_numpy():
    return np.sin(np.arange(10**6))

def plus1_list():
    return [i + 1 for i in range(10**6)]

def plus1_numpy():
    return np.arange(10**6) + 1

# ---------- ZADANIE 3 ----------
def dodaj_wartosci(macierz, nowe):
    return np.append(macierz, nowe)

# ---------- ZADANIE 4 ----------
def generuj_szachownice(rozmiar):
    return np.indices((rozmiar, rozmiar)).sum(axis=0) % 2

# ---------- ZADANIE 5 ----------
def fahrenheit_na_celcjusz(lista_f):
    return [(round((f - 32) * 5 / 9, 2)) for f in lista_f]

# ---------- ZADANIE 6 ----------
def przekatna_macierz(wartosci):
    return np.diag(wartosci)

# ---------- ZADANIE 7 ----------
def odwroc_tablice(macierz):
    return np.array(macierz).flatten()[::-1]

# ---------- ZADANIE 8 ----------
def filtruj_macierz():
    tab = np.arange(100).reshape((10, 10))
    return tab[(tab % 2 == 0) & (tab % 3 != 0)]

# ---------- ZADANIE 9 ----------
def macierz_z_wyznacznikiem(n, zakres, oczekiwany_det):
    while True:
        macierz = np.random.randint(zakres[0], zakres[1], size=(n, n))
        if round(np.linalg.det(macierz)) == oczekiwany_det:
            return macierz

# ---------- URUCHOMIENIE ----------
if __name__ == "__main__":
    print("Zadanie 2 – Czas działania:")
    print("math.sin:", timeit(sinus_math, number=1))
    print("np.sin:", timeit(sinus_numpy, number=1))
    print("lista +1:", timeit(plus1_list, number=1))
    print("numpy +1:", timeit(plus1_numpy, number=1))

    print("\nZadanie 3 – Dodaj wartości:")
    print(dodaj_wartosci(np.array([10, 20, 30]), [40, 50]))

    print("\nZadanie 4 – Szachownica 8x8:")
    print(generuj_szachownice(8))

    print("\nZadanie 5 – Fahrenheit na Celsius:")
    print(fahrenheit_na_celcjusz([0, 12, 45.21, 34, 99.91]))

    print("\nZadanie 6 – Macierz przekątna:")
    print(przekatna_macierz([4, 5, 6, 7]))

    print("\nZadanie 7 – Odwrócenie macierzy:")
    print(odwroc_tablice([[1, 2, 3], [4, 5, 6], [7, 8, 9]]))

    print("\nZadanie 8 – Filtrowanie 10x10:")
    print(filtruj_macierz())

    print("\nZadanie 9 – Macierz o wyznaczniku 1:")
    print(macierz_z_wyznacznikiem(3, (1, 10), 1))
