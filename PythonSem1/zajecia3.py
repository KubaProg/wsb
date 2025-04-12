import pandas as pd
import matplotlib.pyplot as plt

# 1. Wczytaj plik i usuń cudzysłowy z nazw kolumn
df = pd.read_csv("nauczyciele.csv", sep=";", quotechar='"')
df.columns = df.columns.str.replace('"', '').str.strip()

# 2. Zamień przecinki na kropki i konwertuj liczby
df = df.applymap(lambda x: str(x).replace(",", ".") if isinstance(x, str) else x)
for col in df.columns[2:]:
    df[col] = pd.to_numeric(df[col], errors="coerce")

# 3. Przekształć z szerokiego formatu do długiego
df_long = df.melt(id_vars=["Kod", "Nazwa"], var_name="Kategoria", value_name="Liczba")

# 4. Rozbij kategorię na kolumny
def split_kategoria(kat):
    parts = kat.split(";")
    return pd.Series({
        "Stanowisko": parts[0] if len(parts) > 0 else None,
        "Płeć": parts[1] if len(parts) > 1 else None,
        "Typ uczelni": parts[2] if len(parts) > 2 else None,
        "Rok": int(parts[3]) if len(parts) > 3 and parts[3].isdigit() else None
    })

df_long = df_long.join(df_long["Kategoria"].apply(split_kategoria))
df_long.drop(columns=["Kategoria", "Kod"], inplace=True)
df_long.rename(columns={"Nazwa": "Województwo"}, inplace=True)

# 5. Czyszczenie danych
df_long["Liczba"] = pd.to_numeric(df_long["Liczba"], errors="coerce")
df_long.dropna(subset=["Liczba", "Rok"], inplace=True)
df_long["Województwo"] = df_long["Województwo"].str.upper()
df_long["Płeć"] = df_long["Płeć"].str.lower()
df_long["Stanowisko"] = df_long["Stanowisko"].str.lower()
df_long["Typ uczelni"] = df_long["Typ uczelni"].str.lower()

# 6. Wykresy

# a) nauczyciele ogółem w latach 2014–2018 wg województw
etat_lata = df_long[
    (df_long["Rok"].between(2014, 2018)) &
    (df_long["Stanowisko"] == "nauczyciele akademiccy") &
    (df_long["Płeć"] == "ogółem")
]
etat_lata_grouped = etat_lata.groupby(["Województwo", "Rok"])["Liczba"].sum().unstack()
etat_lata_grouped.plot(kind="bar", figsize=(12, 6))
plt.title("Nauczyciele akademiccy ogółem wg województw (2014-2018)")
plt.ylabel("Liczba")
plt.tight_layout()
plt.show()

# b) stanowiska w woj. śląskim
slaskie = df_long[
    (df_long["Województwo"] == "ŚLĄSKIE") &
    (df_long["Rok"].between(2014, 2018))
]
slaskie_grouped = slaskie.groupby(["Stanowisko", "Rok"])["Liczba"].sum().unstack()
slaskie_grouped.plot(kind="bar", figsize=(12, 6))
plt.title("Stanowiska w woj. śląskim (2014–2018)")
plt.ylabel("Liczba")
plt.tight_layout()
plt.show()

# c) uniwersytety vs szkoły techniczne wg płci w śląskim
slaskie_typ = df_long[df_long["Województwo"] == "ŚLĄSKIE"]
typ_grouped = slaskie_typ.groupby(["Typ uczelni", "Płeć"])["Liczba"].sum().unstack()
typ_grouped.plot(kind="bar", figsize=(8, 6))
plt.title("Typ uczelni vs Płeć – ŚLĄSKIE")
plt.ylabel("Liczba")
plt.tight_layout()
plt.show()

# 7. Analizy

# a) tylko woj. śląskie
print("\nDane woj. śląskie:\n", df_long[df_long["Województwo"] == "ŚLĄSKIE"].head(10))

# b) woj. z największą i najmniejszą liczbą nauczycieli akademickich
woj_grouped = df_long[df_long["Stanowisko"] == "nauczyciele akademiccy"].groupby("Województwo")["Liczba"].sum()
print("\nNajwięcej nauczycieli akademickich:", woj_grouped.idxmax(), woj_grouped.max())
print("Najmniej nauczycieli akademickich:", woj_grouped.idxmin(), woj_grouped.min())

# c) woj. gdzie liczba kobiet > średnia
kobiety = df_long[df_long["Płeć"] == "kobiety"]
kobiety_sum = kobiety.groupby("Województwo")["Liczba"].sum()
srednia = kobiety_sum.mean()
print("\nŚrednia liczba kobiet:", srednia)
print("Województwa z kobietami ponad średnią:\n", kobiety_sum[kobiety_sum > srednia])

# 8. Pauza na koniec
input("\nNaciśnij Enter, aby zakończyć...")
