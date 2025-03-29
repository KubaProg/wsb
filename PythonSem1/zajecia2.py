
import random

# Zadanie 1: Klasa Talia z wewnętrzną klasą Karta
class Talia:
    class Karta:
        def __init__(self, rodzaj, wartosc):
            self.rodzaj = rodzaj
            self.wartosc = wartosc
        
        def __str__(self):
            return f"{self.wartosc} {self.rodzaj}"
        
        def __repr__(self):
            return self.__str__()
    
    def __init__(self):
        self.przetasuj()
    
    def przetasuj(self):
        """Tworzy nową talię 52 kart i tasuje ją."""
        rodzaje = ["Kier", "Karo", "Trefl", "Pik"]
        wartosci = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
        self.karty = [Talia.Karta(rodzaj, wartosc) for rodzaj in rodzaje for wartosc in wartosci]
        random.shuffle(self.karty)
    
    def rozdaj(self):
        """Zwraca jedną kartę z talii i usuwa ją."""
        if not self.karty:
            return None
        return self.karty.pop()

# Zadanie 2: Klasy Pojazd, Bus, Samochod
class Pojazd:
    kolor = "biały"  # atrybut klasowy

    def __init__(self, predkosc_max, mileage, nazwa=None, liczba_miejsc=4):
        self.predkosc_max = predkosc_max
        self.mileage = mileage
        self.nazwa = nazwa
        self.liczba_miejsc = liczba_miejsc
    
    def oplata(self):
        """Oblicza opłatę: liczba miejsc * 100"""
        return self.liczba_miejsc * 100
    
    def __str__(self):
        if self.nazwa:
            return f"({self.nazwa}, {self.predkosc_max}, {self.mileage})"
        else:
            return f"({self.predkosc_max}, {self.mileage})"

class Bus(Pojazd):
    def __init__(self, nazwa, predkosc_max, mileage, pojemnosc_calkowita=50):
        super().__init__(predkosc_max, mileage, nazwa, liczba_miejsc=pojemnosc_calkowita)
        self.pojemnosc_calkowita = pojemnosc_calkowita
    
    def oplata(self):
        """Oblicza opłatę z dodatkowym 10% dla busa."""
        podstawowa = super().oplata()
        return podstawowa * 1.10  # dodatkowe 10%
    
    def __str__(self):
        return f"({self.nazwa}, {self.predkosc_max}, {self.mileage})"

class Samochod(Pojazd):
    def __init__(self, nazwa, predkosc_max, mileage, liczba_miejsc=5):
        super().__init__(predkosc_max, mileage, nazwa, liczba_miejsc)
    
    def __str__(self):
        return f"({self.nazwa}, {self.predkosc_max}, {self.mileage})"

def main():
    print("=== Zajęcia 2 - Programowanie Obiektowe ===\n")
    
    # Test zadanie 1: Talia kart
    print("Zadanie 1: Talia kart")
    talia = Talia()
    print("Karty w talii po przetasowaniu:")
    print(talia.karty)
    print("Rozdaję jedną kartę:", talia.rozdaj())
    print("Liczba kart pozostałych w talii:", len(talia.karty))
    print("\n" + "="*50 + "\n")
    
    # Test zadanie 2: Pojazd, Bus, Samochod
    print("Zadanie 2: Pojazd, Bus, Samochod")
    
    # Tworzymy obiekt klasy Pojazd (przykładowo)
    pojazd = Pojazd(240, 18)
    print("Pojazd:", pojazd)
    print("Kolor pojazdu:", Pojazd.kolor)
    print("Opłata dla pojazdu:", pojazd.oplata())
    
    # Tworzymy obiekt klasy Samochod ("Audi Q5")
    samochod = Samochod("Audi Q5", 240, 18, liczba_miejsc=5)
    print("Samochod:", samochod)
    print("Kolor samochodu:", Samochod.kolor)
    print("Opłata dla samochodu:", samochod.oplata())
    
    # Tworzymy obiekt klasy Bus ("School Volvo")
    bus = Bus("School Volvo", 180, 12, pojemnosc_calkowita=50)
    print("Bus:", bus)
    print("Kolor busa:", Bus.kolor)
    print("Opłata dla busa:", bus.oplata())
    
if __name__ == "__main__":
    main()
