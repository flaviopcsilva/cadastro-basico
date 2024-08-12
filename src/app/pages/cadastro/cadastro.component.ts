import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { cpfValidator } from '../../services/cpf-validator';


@Component({
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    NgxMaskDirective,
    ReactiveFormsModule,
  ],
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  cadastroForm: FormGroup;
  verificationForm: FormGroup;
  showVerificationPopup = false;
  notification = { message: '', success: true };

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.cadastroForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required],
      cpf: ['', Validators.required],
      data_de_nascimento: ['', Validators.required],
      telefone: ['', Validators.required],
      cep: ['', Validators.required],
      rua: [''],
      bairro: [''],
      cidade: [''],
      estado: [''],
      numero: ['', Validators.required],
      complemento: [''],
    }, { validator: this.matchPassword });

    this.verificationForm = this.fb.group({
      codigo: ['', Validators.required],
      email: ['', Validators.required]
    });
  }


  matchPassword(group: FormGroup): { [key: string]: boolean } | null {
    const senha = group.get('senha')?.value;
    const confirmarSenha = group.get('confirmarSenha')?.value;

    console.log('Senha:', senha);
    console.log('Confirmar Senha:', confirmarSenha);

    return senha === confirmarSenha ? null : { matchPassword: true };
  }


  onSubmitCadastro(): void {
    if (this.cadastroForm.valid) {
      const cadastroData = this.cadastroForm.value;
      this.http.post('https://base-cadastrocompleto-backend.onrender.com/clientes', cadastroData).subscribe(
        response => {
          this.showNotification('Cadastro realizado! Verifique seu email para o código de confirmação.', true);
          this.showVerificationPopup = true;
        },
        error => {
          this.showNotification(`Erro ao cadastrar: ${error.error.mensagem}`, false);
        }
      );
    } else {
      this.showNotification('Formulário de cadastro inválido!', false);
    }
  }

  onSubmitVerification(): void {
    if (this.verificationForm.valid) {
      const verificationData = this.verificationForm.value;
      this.http.post('https://base-cadastrocompleto-backend.onrender.com/cadastro', verificationData).subscribe(
        response => {
          this.showNotification('Cadastro confirmado com sucesso!', true);
          setTimeout(() => {
            this.router.navigate(['cadastro2']);
          }, 5000);
        },
        error => {
          this.showNotification(`Erro ao confirmar cadastro: ${error.error.mensagem}`, false);
        }
      );
    } else {
      this.showNotification('Código de verificação inválido!', false);
    }
  }

  buscarEnderecoPorCep(cep: string): void {
    this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`).subscribe(
      data => {
        if (data) {
          this.cadastroForm.patchValue({
            rua: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf
          });
        }
      },
      error => {
        this.showNotification('Erro ao buscar endereço.', false);
      }
    );
  }

  showNotification(message: string, success: boolean): void {
    this.notification.message = message;
    this.notification.success = success;

    const notificationElement = document.querySelector('.notification');
    if (notificationElement) {
      notificationElement.classList.add('show');

      setTimeout(() => {
        notificationElement.classList.remove('show');
      }, 8000); // Notificação desaparece após 8 segundos
    }
  }
}
