/**
 * Date mock pentru VitaFit — folosite când backend-ul nu răspunde (rețea, server oprit, CORS).
 * Nu înlocuiesc salvarea reală (profil, progres, mesaje).
 */
window.VitaFitMock = {
  categories: [
    { id: 1, name: 'Slăbit', slug: 'slabit', description: 'Exerciții și sfaturi pentru slăbit.' },
    { id: 2, name: 'Tonifiere', slug: 'tonifiere', description: 'Tonifierea musculaturii.' },
    { id: 3, name: 'Masă Musculară', slug: 'masa-musculara', description: 'Creșterea masei musculare.' },
    { id: 4, name: 'Mobilitate', slug: 'mobilitate', description: 'Flexibilitate și mobilitate.' }
  ],

  posts: [
    {
      id: 101,
      title: 'Bine ai venit pe VitaFit',
      slug: 'bine-ai-venit-pe-vitafit',
      status: 'published',
      published_at: '2025-01-15T10:00:00.000Z',
      content:
        '<p>VitaFit este un proiect dedicat unui stil de viață activ și echilibrat. Aici găsești articole despre nutriție, mișcare și obiceiuri sănătoase.</p><p><strong>Atenție:</strong> informațiile sunt educative și nu înlocuiesc consultul medical.</p>',
      categories: [{ id: 1, name: 'Slăbit', slug: 'slabit' }]
    },
    {
      id: 102,
      title: 'Hidratare corectă',
      slug: 'hidratare-corecta',
      status: 'published',
      published_at: '2025-02-01T12:00:00.000Z',
      content:
        '<p>Apa susține digestia, temperatura corpului și concentrarea. Încearcă să distribui consumul pe parcursul zilei.</p><p>O regulă orientativă: ascultă senzația de sete și culoarea urinei (deschisă la galben = bine).</p>',
      categories: [{ id: 2, name: 'Tonifiere', slug: 'tonifiere' }]
    },
    {
      id: 103,
      title: 'Somn și recuperare',
      slug: 'somn-si-recuperare',
      status: 'published',
      published_at: '2025-02-10T08:00:00.000Z',
      content:
        '<p>Somnul de calitate ajută la recuperare după efort și la reglarea apetitului. Menține o oră regulată de culcare cât poți.</p>',
      categories: [{ id: 4, name: 'Mobilitate', slug: 'mobilitate' }]
    },
    {
      id: 104,
      title: 'Idei pentru mic dejun echilibrat',
      slug: 'mic-dejun-echilibrat',
      status: 'published',
      published_at: '2025-03-01T09:30:00.000Z',
      content:
        '<p>Combină carbohidrați complecși, proteine și fructe sau legume. Exemple: ovăz cu iaurt și fructe, ouă cu pâine integrală.</p><p>Adaptă porțiile la nivelul tău de activitate.</p>',
      categories: [{ id: 1, name: 'Slăbit', slug: 'slabit' }]
    }
  ]
};
