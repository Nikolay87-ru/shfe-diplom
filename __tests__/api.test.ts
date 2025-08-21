import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { api } from '@/utils/api';
import type { Film, Hall, Seance } from '@/types';

const API_URL = 'https://shfe-diplom.neto-server.ru';

const mockData = {
  films: [
    {
      id: 1,
      film_name: 'Test Film',
      film_description: 'Test Description',
      film_duration: 120,
      film_origin: 'Test Country',
      film_poster: 'test.jpg',
    },
  ] as Film[],
  halls: [
    {
      id: 1,
      hall_name: 'Test Hall',
      hall_open: 1,
      hall_rows: 5,
      hall_places: 10,
      hall_price_standart: 300,
      hall_price_vip: 500,
      hall_config: Array(5).fill(Array(10).fill('standart')),
    },
  ] as Hall[],
  seances: [
    {
      id: 1,
      seance_filmid: 1,
      seance_hallid: 1,
      seance_time: '10:00',
    },
  ] as Seance[],
};

const server = setupServer(
  http.get(`${API_URL}/alldata`, () => {
    return HttpResponse.json({
      success: true,
      result: mockData,
    });
  }),

  http.post(`${API_URL}/hall`, async ({ request }) => {
    const formData = await request.formData();
    const hallName = formData.get('hallName');

    if (!hallName) {
      return HttpResponse.json(
        {
          success: false,
          error: 'Hall name is required',
        },
        { status: 400 },
      );
    }

    const newHall: Hall = {
      id: Date.now(),
      hall_name: hallName.toString(),
      hall_open: 0,
      hall_rows: 0,
      hall_places: 0,
      hall_price_standart: 0,
      hall_price_vip: 0,
      hall_config: [],
    };

    mockData.halls.push(newHall);
    return HttpResponse.json({ success: true, result: { halls: [newHall] } });
  }),

  http.post(`${API_URL}/hall/:id`, async ({ params, request }) => {
    const { id } = params;
    const formData = await request.formData();

    const hall = mockData.halls.find((h) => h.id === Number(id));
    if (!hall) {
      return HttpResponse.json(
        {
          success: false,
          error: 'Hall not found',
        },
        { status: 404 },
      );
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

    const hall = mockData.halls.find((h) => h.id === Number(id));
    if (!hall) {
      return HttpResponse.json(
        {
          success: false,
          error: 'Hall not found',
        },
        { status: 404 },
      );
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

    const hall = mockData.halls.find((h) => h.id === Number(id));
    if (!hall) {
      return HttpResponse.json(
        {
          success: false,
          error: 'Hall not found',
        },
        { status: 404 },
      );
    }

    const hallOpen = formData.get('hallOpen');
    if (hallOpen) hall.hall_open = Number(hallOpen) as 0 | 1;

    return HttpResponse.json({ success: true, result: { halls: [hall] } });
  }),

  http.delete(`${API_URL}/hall/:id`, async ({ params }) => {
    const { id } = params;
    const index = mockData.halls.findIndex((h) => h.id === Number(id));

    if (index === -1) {
      return HttpResponse.json(
        {
          success: false,
          error: 'Hall not found',
        },
        { status: 404 },
      );
    }

    mockData.halls.splice(index, 1);
    return HttpResponse.json({ success: true, result: { halls: mockData.halls } });
  }),

  http.post(`${API_URL}/film`, async ({ request }) => {
    const formData = await request.formData();

    const newFilm: Film = {
      id: Date.now(),
      film_name: formData.get('filmName')?.toString() || '',
      film_description: formData.get('filmDescription')?.toString() || '',
      film_duration: Number(formData.get('filmDuration')),
      film_origin: formData.get('filmOrigin')?.toString() || '',
      film_poster: formData.get('filePoster')?.toString() || 'default.jpg',
    };

    mockData.films.push(newFilm);
    return HttpResponse.json({ success: true, result: { films: [newFilm] } });
  }),

  http.delete(`${API_URL}/film/:id`, async ({ params }) => {
    const { id } = params;
    const index = mockData.films.findIndex((f) => f.id === Number(id));

    if (index === -1) {
      return HttpResponse.json(
        {
          success: false,
          error: 'Film not found',
        },
        { status: 404 },
      );
    }

    mockData.films.splice(index, 1);
    return HttpResponse.json({ success: true, result: { films: mockData.films } });
  }),

  http.post(`${API_URL}/seance`, async ({ request }) => {
    const formData = await request.formData();

    const newSeance: Seance = {
      id: Date.now(),
      seance_filmid: Number(formData.get('seanceFilmid')),
      seance_hallid: Number(formData.get('seanceHallid')),
      seance_time: formData.get('seanceTime')?.toString() || '',
    };

    mockData.seances.push(newSeance);
    return HttpResponse.json({ success: true, result: { seances: [newSeance] } });
  }),

  http.delete(`${API_URL}/seance/:id`, async ({ params }) => {
    const { id } = params;
    const index = mockData.seances.findIndex((s) => s.id === Number(id));

    if (index === -1) {
      return HttpResponse.json(
        {
          success: false,
          error: 'Seance not found',
        },
        { status: 404 },
      );
    }

    mockData.seances.splice(index, 1);
    return HttpResponse.json({ success: true, result: { seances: mockData.seances } });
  }),

  http.get(`${API_URL}/hallconfig`, () => {

    const hall = mockData.halls[0];
    if (!hall) {
      return HttpResponse.json(
        {
          success: false,
          error: 'Hall not found',
        },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      success: true,
      result: hall.hall_config,
    });
  }),

  http.post(`${API_URL}/ticket`, async () => {
    return HttpResponse.json({
      success: true,
      qrCode: 'mocked-qr-code',
      bookingCode: 'MOCKED-CODE',
    });
  }),
);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

describe('API Module', () => {
  it('should fetch all data', async () => {
    const response = await api.getAllData();
    expect(response.success).toBe(true);
    expect(response.result?.films?.length).toBeGreaterThan(0);
    expect(response.result?.halls?.length).toBeGreaterThan(0);
    expect(response.result?.seances?.length).toBeGreaterThan(0);
  });

  it('should add a new hall', async () => {
    const response = await api.addHall('New Hall');
    expect(response.success).toBe(true);
    expect(response.result?.halls?.[0].hall_name).toBe('New Hall');
  });

  it('should update hall config', async () => {
    const config = {
      rowCount: 5,
      placeCount: 10,
      config: Array(5).fill(Array(10).fill('standart')),
    };
    const response = await api.updateHallConfig(1, config);
    expect(response.success).toBe(true);
    expect(response.result?.halls?.[0].hall_rows).toBe(5);
  });

  it('should update hall prices', async () => {
    const prices = {
      standartPrice: 350,
      vipPrice: 550,
    };
    const response = await api.updateHallPrices(1, prices);
    expect(response.success).toBe(true);
    expect(response.result?.halls?.[0].hall_price_standart).toBe(350);
  });

  it('should update hall status', async () => {
    const response = await api.updateHallStatus(1, 0);
    expect(response.success).toBe(true);
    expect(response.result?.halls?.[0].hall_open).toBe(0);
  });

  it('should delete a hall', async () => {
    const response = await api.deleteHall(1);
    expect(response.success).toBe(true);
  });

  it('should add a new film', async () => {
    const filmData = {
      name: 'New Film',
      duration: 120,
      description: 'Description',
      country: 'Country',
      poster: new File([''], 'poster.jpg', { type: 'image/jpeg' }),
    };
    const response = await api.addMovie(filmData);
    expect(response.success).toBe(true);
    expect(response.result?.films?.[0].film_name).toBe('New Film');
  });

  it('should delete a film', async () => {
    const response = await api.deleteMovie(1);
    expect(response.success).toBe(true);
  });

  it('should add a new seance', async () => {
    const seanceData = {
      hallId: 1,
      movieId: 1,
      time: '12:00',
    };
    const response = await api.addSeance(seanceData);
    expect(response.success).toBe(true);
    expect(response.result?.seances?.[0].seance_time).toBe('12:00');
  });

  it('should delete a seance', async () => {
    const response = await api.deleteSeance(1);
    expect(response.success).toBe(true);
  });

  it('should get hall config', async () => {
    const response = await api.getHallConfig('1', '2025-08-02');
    expect(response.success).toBe(true);
    expect(response.result).toBeDefined();
  });
});
