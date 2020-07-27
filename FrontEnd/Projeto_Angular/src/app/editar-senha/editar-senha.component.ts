import { Component, OnInit } from '@angular/core';
import { Usuario } from '../models/usuario';
import { UsuarioService } from '../services/usuario.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-editar-senha',
  templateUrl: './editar-senha.component.html',
  styleUrls: ['./editar-senha.component.css']
})
export class EditarSenhaComponent implements OnInit {

  usuario: Usuario = new Usuario;
  delStatus: boolean = false;
  delFalha: boolean = false;
  alertMessage: String;

  constructor(private usuarioService: UsuarioService, private route: Router) { }

  ngOnInit(): void {
    window.scroll(0, 0);
  }

  editarSenha() {
    this.usuarioService.redefinirSenha(this.usuario.email).subscribe((resp: Usuario) => {
      this.usuario = resp
      this.usuario.senha = Math.random().toString(36).substr(2, 9) + Math.floor(Math.random() * 10);
      this.usuarioService.attSenha(this.usuario).subscribe(() => {
        this.delStatus = true;
        this.alertMessage = 'Nova senha encaminhada ao e-mail cadastrado.';
        setTimeout(() => {
          location.assign('/home');
        }, 5000);
      })
    }, err => {
      this.delFalha = true;
      this.alertMessage = 'Usuario não existe.';
    })
  }

}
