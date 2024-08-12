import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgxMaskDirective } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [
    HttpClientModule,
    NgxMaskDirective,
    CommonModule,
    ReactiveFormsModule
  ],
  selector: 'app-listar-clientes',
  templateUrl: './listar-clientes.component.html',
  styleUrls: ['./listar-clientes.component.css'],
})
export class ListarClientesComponent implements OnInit {
  clientes: any[] = [];
  clienteSelecionado: any = null;
  private apiUrl = 'https://base-cadastrocompleto-backend.onrender.com';
  notification = { message: '', success: true };

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.listarClientes();
  }

  listarClientes() {
    this.http.get<any[]>(`${this.apiUrl}/clientes`).subscribe((data) => {
      this.clientes = data;
    });
  }

  selecionarCliente(cliente: any) {
    this.clienteSelecionado = cliente;
  }

  fecharPopup() {
    this.clienteSelecionado = null;
  }

  editarCliente(cliente: any) {
    console.log('Editando cliente:', cliente);
    // Implementar a lógica de edição aqui
    this.fecharPopup();
  }

  excluirCliente(cliente: any) {

    if (confirm(`Deseja realmente excluir ${cliente.nome}?`)) {
      this.http.delete(`${this.apiUrl}/cliente/${cliente.email}`).subscribe(() => {
        this.listarClientes();
        this.showNotification('Cliente excluido com sucesso!', true);
        this.fecharPopup();
      }, error => {
        console.log(error.error);

        this.showNotification(`Erro ao Excluir Cliente: ${error.error.mensagem}`, false);
      });
    }

  }

  showNotification(message: string, success: boolean): void {
    this.notification.message = message;
    this.notification.success = success;

    const notificationElement = document.querySelector('.notification');
    if (notificationElement) {
      notificationElement.classList.add('show');

      setTimeout(() => {
        notificationElement.classList.remove('show');
        this.notification.message = ''; // Limpar mensagem após a exibição
      }, 7000);
    }
  }


}
