import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private apiUrl = 'https://base-cadastrocompleto-backend.onrender.com';  // Substitua pelo seu backend URL


  constructor(private http: HttpClient) { }

  listarClientes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/clientes`);
  }

  cadastrarCliente(cliente: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/clientes`, cliente);
  }

  confirmarCadastro(email: string, codigo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/cadastro`, { email, codigo });
  }

  excluirCliente(email: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clientes`, { headers: new HttpHeaders({ email }) });
  }

  buscarCPF(cpf: string, dataNascimento: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/buscar-cpf`, { cpf, dataNascimento });
  }

  buscarCEP(cep: string): Observable<any> {
    return this.http.get(`https://viacep.com.br/ws/${cep}/json/`);
  }

  getClientes(page: number, limit: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&limit=${limit}`);
  }

}
