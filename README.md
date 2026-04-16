# VitaFit - Atestat Informatică

VitaFit este o aplicație web dezvoltată pentru proiectul de atestat la informatică (clasa a XII-a). Acest proiect își propune să ofere utilizatorilor resurse și instrumente utile pentru menținerea unui stil de viață sănătos, îmbinând nutriția, antrenamentele și monitorizarea progresului fizic.

## 1. Descrierea Proiectului

Platforma **VitaFit** este alcătuită din două componente principale:
- **Frontend-ul** (partea de interfață vizuală cu utilizatorul)
- **Backend-ul** (partea de server care gestionează logica și stocarea datelor)

Scopul principal al aplicației este de a încuraja utilizatorii să aibă un stil de viață activ și o alimentație corectă. 

### Funcționalități principale:
- **Calculator BMI (Indicele de Masă Corporală):** Un utilitar pentru a ajuta utilizatorii să își calculeze indicele de masă corporală și să primească o evaluare a stării lor generale (Subponderal, Greutate normală, Supraponderal, etc.).
- **Secțiune de Nutriție:** O pagină dedicată sfaturilor de nutriție și rețetelor sănătoase.
- **Secțiune de Exerciții:** Articole și ghiduri despre antrenamente, tipuri de exerciții și importanța recuperării.
- **Monitorizare Progres:** O funcționalitate unde utilizatorii își pot încărca fotografii și pot ține un jurnal al evoluției lor fizice.
- **Profil Utilizator:** Posibilitatea utilizatorilor de a-și gestiona datele personale și istoricul progresului.
- **Formular de Contact:** O modalitate simplă prin care utilizatorii pot lăsa mesaje sau feedback dezvoltatorului.

## 2. Arhitectura și Tehnologii Utilizate

Aplicația urmează o arhitectură **Client-Server** clasică, decuplând clar interfața de utilizator de logica de business.

### Frontend
Partea de frontend a fost dezvoltată folosind tehnologii web standard, fără a depinde de framework-uri complexe, demonstrând o înțelegere solidă a bazelor dezvoltării web:
- **HTML5:** Pentru structurarea corectă, semantică a conținutului din pagini.
- **CSS3:** Pentru stilizarea paginilor, inclusiv un design modern, responsiv (adaptabil pe orice rezoluție sau dispozitiv mobil).
- **JavaScript (Vanilla):** Pentru interactivitatea interfeței (calculatorul BMI, ferestre modale, meniuri) și pentru realizarea cererilor asincrone (`fetch` API) către serverul backend.
- **Găzduire (Hosting):** Frontend-ul este găzduit utilizând **GitHub Pages**.

### Backend
Partea de server a fost construită în Node.js, expunând o serie de rute (endpoint-uri) de tip RESTful API.
- **Node.js & Express.js:** Utilizat pentru crearea serverului web, procesarea request-urilor HTTP și a middleware-urilor (cum ar fi CORS și procesarea de JSON).
- **Bază de Date (MySQL):** Folosită pentru stocarea permanentă a utilizatorilor, articolelor (postărilor), categoriilor și a mesajelor primite din formularul de contact.
- **Tehnologii Adiacente:** Pachete pentru procesarea încărcării de fișiere multimedia (fotografiile de progres).
- **Găzduire (Hosting):** Backend-ul este găzduit pe platforma **Vercel** (`https://vitafit3.vercel.app/`), profitând de capabilitățile Serverless (Functii Vercel).

## 3. Structura Proiectului (Directoare și Fișiere)

- `/index.html` - Pagina principală a aplicației (Home).
- `/styles.css` - Fișierul general de stilizare pentru toate paginile.
- `/script.js` - Scriptul care conține logica principală de interfață.
- `/api.js` - Modulul care definește obiectul `VitaFitAPI`, acționând ca un intermediar între frontend și backend (aici sunt definite toate apelurile de rețea cu `fetch`).
- `/bmi-calculator/`, `/nutritie/`, `/exercitii/`, `/progres/`, `/profil/` - Directoare separate ce conțin paginile specifice (structurate modular) pentru funcționalitățile respective.
- `/backend/` - Directorul principal care conține logica serverului Node.js:
  - `/backend/src/app.js` - Fișierul de configurare al serverului Express.
  - `/backend/src/db.js` - Configurațiile pentru conectarea la baza de date MySQL.
  - `/backend/src/routes/` - Rutele API-ului (utilizatori, postări, categorii, contact, etc.).
  - `/backend/api/index.js` - Fișierul de intrare pentru funcțiile Serverless de pe Vercel.

## 4. Integrarea (Comunicarea Frontend - Backend)

Frontend-ul folosește obiectul JavaScript global `VitaFitAPI` definit în fișierul `api.js`. Acesta conține o adresă de bază (Base URL) setată la `https://vitafit3.vercel.app/api`. 

De fiecare dată când un vizitator interacționează cu o anumită pagină din frontend (de exemplu: trimite un mesaj în secțiunea de contact sau încarcă o fotografie de progres), fișierul JavaScript va executa o funcție asincronă care trimite datele către serverul găzduit pe Vercel prin intermediul unei cereri HTTP (GET, POST etc.). Serverul va procesa informațiile, va interoga sau va modifica baza de date și va răspunde către frontend (uzual în format JSON).

## 5. Instrucțiuni de Instalare / Rulare Locală (Pentru Profesori / Evaluatori)

Deoarece aplicația este deja publicată (Hosted), ea poate fi testată și verificată direct folosind link-ul asigurat de GitHub Pages.

În cazul în care se dorește rularea locală a întregului proiect:

### 5.1. Rularea Frontend-ului
1. Este suficientă deschiderea fișierului `index.html` într-un browser web. 
   *(Recomandare: pentru funcționalități complete legate de API, rulați frontend-ul pe un server local folosind extensia "Live Server" din VS Code).*
2. Accesați fișierul `api.js` și schimbați proprietatea `baseUrl` în `http://localhost:4000/api`.

### 5.2. Rularea Backend-ului
1. Deschideți un terminal în directorul `/backend`.
2. Asigurați-vă că aveți instalat Node.js pe sistem.
3. Instalați dependențele rulând comanda: `npm install`.
4. Creați un fișier `.env` pornind de la un posibil `.env.example` și completați credențialele de conectare către serverul de MySQL local (sau remote).
5. Porniți serverul rulând comanda: `npm start` sau `node src/app.js`.
6. Verificați că terminalul afișează mesajul de pornire și că serverul rulează pe portul `4000`.

## 6. Concluzii

Acest proiect demonstrează însușirea conceptelor de programare full-stack, a lucrului cu baze de date relaționale, realizarea unei interfețe web atractive, precum și modalitatea de a aduce aplicația de la stadiul de "cod pe calculatorul personal" în mediul de producție (online), folosind servicii de hosting moderne precum Vercel și GitHub Pages.
