import { 
  AuthUser, 
  MedicineProduct, 
  StoreInventoryItem, 
  PrescriptionDispenseRequest, 
  PlatformUserItem, 
  DiscrepancyTicket 
} from '../types';

const API_BASE_URL = 'http://localhost:4000/api/v1';

class ApiClient {
  private getToken(): string | null {
    // In a real app, this would get the JWT from localStorage/context
    // For this mock phase, we'll assume the token is saved in localStorage under 'authToken'
    return localStorage.getItem('authToken');
  }

  private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers = new Headers(options.headers || {});
    
    headers.set('Content-Type', 'application/json');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'API Error');
    }

    return result.data;
  }

  // Auth
  public async login(email: string): Promise<{ token: string; user: AuthUser }> {
    const data = await this.fetch<{ token: string; user: AuthUser }>(`/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email })
    });
    localStorage.setItem('authToken', data.token);
    return data;
  }

  // Medicines
  public searchMedicines(query: string = ''): Promise<MedicineProduct[]> {
    return this.fetch(`/medicines/search?query=${encodeURIComponent(query)}`);
  }

  // Pharmacist
  public getPrescriptions(): Promise<PrescriptionDispenseRequest[]> {
    return this.fetch(`/pharmacist/prescriptions`);
  }

  // Admin
  public getPlatformUsers(): Promise<AuthUser[]> {
    return this.fetch(`/admin/users`);
  }

  public getDiscrepancies(): Promise<DiscrepancyTicket[]> {
    return this.fetch(`/admin/discrepancies`);
  }
}

export const api = new ApiClient();
