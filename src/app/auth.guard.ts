import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router) { }

    canActivate(): boolean {
        const token = localStorage.getItem('token');
        const expiresIn = localStorage.getItem('expiresIn');

        console.log(expiresIn);


        if (token && expiresIn && new Date().getTime() < Number(expiresIn)) {
            return true;
        } else {

            this.handleInvalidToken();
            return false;
        }
    }

    private handleInvalidToken(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('expiresIn');
        this.showNotification('Seu token é inválido ou expirou. Por favor, faça login novamente.', false);
        this.router.navigate(['home']);
    }


    private showNotification(message: string, isSuccess: boolean): void {
        const notificationElement = document.createElement('div');
        notificationElement.innerText = message;
        notificationElement.style.position = 'fixed';
        notificationElement.style.top = '20px';
        notificationElement.style.right = '20px';
        notificationElement.style.padding = '10px';
        notificationElement.style.borderRadius = '5px';
        notificationElement.style.backgroundColor = isSuccess ? '#4caf50' : '#f44336';
        notificationElement.style.color = 'white';
        notificationElement.style.zIndex = '1000';

        document.body.appendChild(notificationElement);

        setTimeout(() => {
            document.body.removeChild(notificationElement);
        }, 3000); // A notificação desaparecerá após 3 segundos
    }
}
