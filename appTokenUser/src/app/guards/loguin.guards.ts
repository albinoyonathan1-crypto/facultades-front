import { inject } from "@angular/core";
import { AlertasService } from "../servicios/alertas.service";
import { Router, UrlTree } from "@angular/router";
import { SonidoService } from "../servicios/sonido-service.service";

export const loguinGuard = (): boolean | UrlTree => {
    const alertasService = inject(AlertasService);
    const router = inject(Router);
    const sonidos = inject(SonidoService);
    const isAuthenticated = !!localStorage.getItem('authToken');

    if (isAuthenticated) {
        return true;
    } else {
        sonidos.error();
        alertasService.error("Necesitas estar logueado para realizar esta acción");
        return router.createUrlTree(["loguin"]); 
    }
};
