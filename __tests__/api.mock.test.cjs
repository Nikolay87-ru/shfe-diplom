const { describe, test, expect, beforeAll, afterEach, afterAll } = require('@jest/globals');
const { setupServer } = require('msw/node');
const { http, HttpResponse } = require('msw');
const { api } = require('@/utils/api');

const mockData = {
  films: [
    {
      id: 1,
      film_name: 'Test Film',
      film_description: 'Test Description',
      film_duration: 120,
      film_origin: 'Test Country',
      film_poster: 'test.jpg'
    }
  ],
  halls: [
    {
      id: 1,
      hall_name: 'Test Hall',
      hall_open: 1,
      hall_rows: 5,
      hall_places: 10,
      hall_price_standart: 300,
      hall_price_vip: 500,
      hall_config: Array(5).fill(Array(10).fill('standart'))
    }
  ],
  seances: [
    {
      id: 1,
      seance_filmid: 1,
      seance_hallid: 1,
      seance_time: '10:00'
    }
  ]
};

const server = setupServer(
  http.get('http://localhost/api/alldata', () => {
    return HttpResponse.json({
      success: true,
      result: mockData
    });
  }),

  http.post(`${API_URL}/hall`, async ({ request }) => {
    const formData = await request.formData();
    const hallName = formData.get('hallName');
    
    if (!hallName) {
      return HttpResponse.json({
        success: false,
        error: 'Hall name is required'
      }, { status: 400 });
    }

    const newHall = {
      id: Date.now(),
      hall_name: hallName.toString(),
      hall_open: 0,
      hall_rows: 0,
      hall_places: 0,
      hall_price_standart: 0,
      hall_price_vip: 0,
      hall_config: []
    };

    mockData.halls.push(newHall);
    return HttpResponse.json({ success: true, result: { halls: [newHall] } });
  }),

  http.post(`${API_URL}/hall/:id`, async ({ params, request }) => {
    const { id } = params;
    const formData = await request.formData();
    
    const hall = mockData.halls.find(h => h.id === Number(id));
    if (!hall) {
      return HttpResponse.json({
        success: false,
        error: 'Hall not found'
      }, { status: 404 });
    }

    const rowCount = formData.get('rowCount');
    const placeCount = formData.get('placeCount');
    const config = formData.get('config');

    if (rowCount) hall.hall_rows = Number(rowCount);
    if (placeCount) hall.hall_places = Number(placeCount);
    if (config) hall.hall_config = JSON.parse(config.toString());

    return HttpResponse.json({ success: true, result: { halls: [hall] } });
  }),

  http.post(`${API_URL}/price/:id`, async ({ params, request }) => {
    const { id } = params;
    const formData = await request.formData();
    
    const hall = mockData.halls.find(h => h.id === Number(id));
    if (!hall) {
      return HttpResponse.json({
        success: false,
        error: 'Hall not found'
      }, { status: 404 });
    }

    const priceStandart = formData.get('priceStandart');
    const priceVip = formData.get('priceVip');

    if (priceStandart) hall.hall_price_standart = Number(priceStandart);
    if (priceVip) hall.hall_price_vip = Number(priceVip);

    return HttpResponse.json({ success: true, result: { halls: [hall] } });
  }),

  http.post(`${API_URL}/open/:id`, async ({ params, request }) => {
    const { id } = params;
    const formData = await request.formData();
    
    const hall = mockData.halls.find(h => h.id === Number(id));
    if (!hall) {
      return HttpResponse.json({
        success: false,
        error: 'Hall not found'
      }, { status: 404 });
    }

    const hallOpen = formData.get('hallOpen');
    if (hallOpen) hall.hall_open = Number(hallOpen);

    return HttpResponse.json({ success: true, result: { halls: [hall] } });
  }),

  http.delete(`${API_URL}/hall/:id`, async ({ params }) => {
    const { id } = params;
    const index = mockData.halls.findIndex(h => h.id === Number(id));
    
    if (index === -1) {
      return HttpResponse.json({
        success: false,
        error: 'Hall not found'
      }, { status: 404 });
    }

    mockData.halls.splice(index, 1);
    return HttpResponse.json({ success: true, result: { halls: mockData.halls } });
  }),

  http.post(`${API_URL}/film`, async ({ request }) => {
    const formData = await request.formData();
    
    const newFilm = {
      id: Date.now(),
      film_name: formData.get('filmName')?.toString() || '',
      film_description: formData.get('filmDescription')?.toString() || '',
      film_duration: Number(formData.get('filmDuration')),
      film_origin: formData.get('filmOrigin')?.toString() || '',
      film_poster: formData.get('filePoster')?.toString() || 'default.jpg'
    };

    mockData.films.push(newFilm);
    return HttpResponse.json({ success: true, result: { films: [newFilm] } });
  }),

  http.delete(`${API_URL}/film/:id`, async ({ params }) => {
    const { id } = params;
    const index = mockData.films.findIndex(f => f.id === Number(id));
    
    if (index === -1) {
      return HttpResponse.json({
        success: false,
        error: 'Film not found'
      }, { status: 404 });
    }

    mockData.films.splice(index, 1);
    return HttpResponse.json({ success: true, result: { films: mockData.films } });
  }),

  http.post(`${API_URL}/seance`, async ({ request }) => {
    const formData = await request.formData();
    
    const newSeance = {
      id: Date.now(),
      seance_filmid: Number(formData.get('seanceFilmid')),
      seance_hallid: Number(formData.get('seanceHallid')),
      seance_time: formData.get('seanceTime')?.toString() || ''
    };

    mockData.seances.push(newSeance);
    return HttpResponse.json({ success: true, result: { seances: [newSeance] } });
  }),

  http.delete(`${API_URL}/seance/:id`, async ({ params }) => {
    const { id } = params;
    const index = mockData.seances.findIndex(s => s.id === Number(id));
    
    if (index === -1) {
      return HttpResponse.json({
        success: false,
        error: 'Seance not found'
      }, { status: 404 });
    }

    mockData.seances.splice(index, 1);
    return HttpResponse.json({ success: true, result: { seances: mockData.seances } });
  })
);

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

describe('API Tests', () => {
  test('getAllData returns all data', async () => {
    const response = await api.getAllData();
    expect(response.success).toBe(true);
    expect(response.result?.films).toBeDefined();
    expect(response.result?.halls).toBeDefined();
    expect(response.result?.seances).toBeDefined();
  });

  test('addHall creates new hall', async () => {
    const response = await api.addHall('New Hall');
    expect(response.success).toBe(true);
    expect(response.result?.halls).toBeDefined();
    expect(response.result?.halls?.[0].hall_name).toBe('New Hall');
  });

  test('updateHallConfig updates hall config', async () => {
    const config = {
      rowCount: 5,
      placeCount: 10,
      config: Array(5).fill(Array(10).fill('standart'))
    };
    const response = await api.updateHallConfig(1, config);
    expect(response.success).toBe(true);
    expect(response.result?.halls?.[0].hall_rows).toBe(5);
    expect(response.result?.halls?.[0].hall_places).toBe(10);
  });

  test('updateHallPrices updates prices', async () => {
    const prices = {
      standartPrice: 350,
      vipPrice: 550
    };
    const response = await api.updateHallPrices(1, prices);
    expect(response.success).toBe(true);
    expect(response.result?.halls?.[0].hall_price_standart).toBe(350);
    expect(response.result?.halls?.[0].hall_price_vip).toBe(550);
  });

  test('updateHallStatus updates hall status', async () => {
    const response = await api.updateHallStatus(1, 0);
    expect(response.success).toBe(true);
    expect(response.result?.halls?.[0].hall_open).toBe(0);
  });

  test('deleteHall removes hall', async () => {
    const response = await api.deleteHall(1);
    expect(response.success).toBe(true);
    expect(response.result?.halls).toBeDefined();
  });

  test('addFilm creates new film', async () => {
    const filmData = {
      name: 'New Film',
      duration: 120,
      description: 'Description',
      country: 'Country',
      poster: new File([''], 'poster.jpg')
    };
    const response = await api.addMovie(filmData);
    expect(response.success).toBe(true);
    expect(response.result?.films?.[0].film_name).toBe('New Film');
  });

  test('deleteFilm removes film', async () => {
    const response = await api.deleteMovie(1);
    expect(response.success).toBe(true);
    expect(response.result?.films).toBeDefined();
  });

  test('addSeance creates new seance', async () => {
    const seanceData = {
      hallId: 1,
      movieId: 1,
      time: '12:00'
    };
    const response = await api.addSeance(seanceData);
    expect(response.success).toBe(true);
    expect(response.result?.seances?.[0].seance_time).toBe('12:00');
  });

  test('deleteSeance removes seance', async () => {
    const response = await api.deleteSeance(1);
    expect(response.success).toBe(true);
    expect(response.result?.seances).toBeDefined();
  });
});