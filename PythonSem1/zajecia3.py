import pandas as pd
import matplotlib.pyplot as plt

# ---------- ZESTAW 1 ----------
# 1. Wczytanie danych nauczycieli
nauczyciele = pd.read_csv("nauczyciele.csv")

# 2. Wstępne czyszczenie
nauczyciele.dropna(how="all", inplace=True)  # usuń puste wiersze
nauczyciele.columns = nauczyciele.columns.str.strip()  # usuń spacje z nazw kolumn

# Przykładowe wyświetlenie kolumn:
print("Kolumny w danych nauczyciele:", nauczyciele.columns.tolist())

# 3. Wykresy

# a) nauczyciele w latach 2014–2018 wg województw
etat_lata = nauczyciele[
    (nauczyciele["Rok"].between(2014, 2018)) & (nauczyciele["Stanowisko"] == "Ogółem")
]
etat_lata_grouped = etat_lata.groupby(["Województwo", "Rok"])["Liczba"].sum().unstack()
etat_lata_grouped.plot(kind="bar", figsize=(10, 6))
plt.title("Nauczyciele wg województw (2014-2018)")
plt.ylabel("Liczba zatrudnionych")
plt.tight_layout()
plt.show()

# b) stanowiska w woj. śląskim (2014–2018)
slaskie = nauczyciele[
    (nauczyciele["Rok"].between(2014, 2018)) & (nauczyciele["Województwo"] == "śląskie")
]
slaskie_grouped = slaskie.groupby(["Stanowisko", "Rok"])["Liczba"].sum().unstack()
slaskie_grouped.plot(kind="bar", figsize=(10, 6))
plt.title("Stanowiska w woj. śląskim (2014–2018)")
plt.ylabel("Liczba")
plt.tight_layout()
plt.show()

# c) uniwersytety vs szkoły techniczne wg płci w śląskim
slaskie_typ = nauczyciele[nauczyciele["Województwo"] == "śląskie"]
typ_grouped = slaskie_typ.groupby(["Typ uczelni", "Płeć"])["Liczba"].sum().unstack()
typ_grouped.plot(kind="bar", figsize=(6, 5))
plt.title("Typ uczelni vs Płeć – śląskie")
plt.ylabel("Liczba zatrudnionych")
plt.tight_layout()
plt.show()

# 4. Analizy

# a) tylko woj. śląskie
print("\nDane woj. śląskie:\n", nauczyciele[nauczyciele["Województwo"] == "śląskie"])

# b) woj. z największą i najmniejszą liczbą nauczycieli
woj_grouped = nauczyciele.groupby("Województwo")["Liczba"].sum()
print("\nNajwięcej nauczycieli:", woj_grouped.idxmax(), woj_grouped.max())
print("Najmniej nauczycieli:", woj_grouped.idxmin(), woj_grouped.min())

# c) woj. gdzie kobiety > średnia
kobiety = nauczyciele[nauczyciele["Płeć"] == "Kobiety"]
kobiety_woj = kobiety.groupby("Województwo")["Liczba"].sum()
srednia_k = kobiety_woj.mean()
ponad_srednia = kobiety_woj[kobiety_woj > srednia_k]
print("\nWojewództwa z kobietami ponad średnią:\n", ponad_srednia)

# ---------- ZESTAW 2 ----------
# 1. Wczytaj inflację (wiele arkuszy)
inflacja_xlsx = pd.read_excel("inflacja.xlsx", sheet_name=None)

# 2. Usuwanie zbędnych wierszy i kolumn (dla każdego arkusza)
inflacja = {}
for rok, df in inflacja_xlsx.items():
    df = df.dropna(how="all").dropna(axis=1, how="all")  # usuń puste
    df.columns = df.iloc[0]  # ustaw pierwszy wiersz jako nagłówki
    df = df[1:]
    inflacja[rok] = df.reset_index(drop=True)

# 3. Wykresy
def wykres_wartosci(df_dict, kolumna, tytul):
    df_combined = pd.DataFrame({
        rok: pd.to_numeric(df[kolumna], errors='coerce') for rok, df in df_dict.items()
    })
    df_combined.plot(kind="bar", figsize=(8, 6))
    plt.title(tytul)
    plt.ylabel("Inflacja [%]")
    plt.tight_layout()
    plt.show()

# a) Rok do grudnia poprzedniego (Table 1)
wykres_wartosci(inflacja, "Rok do grudnia poprzedniego", "Inflacja – Rok do grudnia poprzedniego")

# b) Październik do września (Table 2)
wykres_wartosci(inflacja, "październik", "Inflacja – Październik do września")

# c) Rok do analogicznego miesiąca poprzedniego (Table 3)
wykres_wartosci(inflacja, "Rok do analogicznego miesiąca poprzedniego", "Inflacja – Rok do analogicznego miesiąca")

# 4. Analizy inflacji
for rok, df in inflacja.items():
    df_num = df.apply(pd.to_numeric, errors='coerce')
    print(f"\nInflacja {rok}:")
    print("- Największa wartość:\n", df_num.max())
    print("- Najmniejsza wartość:\n", df_num.min())
    print("- Średnia wartość:\n", df_num.mean())
