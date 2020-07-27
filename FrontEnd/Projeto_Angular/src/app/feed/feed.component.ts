import { Component, OnInit } from '@angular/core';
import { PostagemService } from '../services/postagem.service';
import { Postagem } from '../models/Postagem';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../models/usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  postStatus: boolean = false;
  alertMessage: String;
  key: string = 'data';
  reverse: boolean = true;

  listaPostagens: Postagem[];

  postagem: Postagem = new Postagem
  usuario: Usuario = new Usuario;

  constructor(private postagemService: PostagemService, private usuarioService: UsuarioService, private router: Router) { }

  ngOnInit() {

    window.scroll(0, 0);
    if (localStorage.getItem('Token') == null) {
      this.router.navigate(["/notFound"])
    } else {
      this.findAllPostagens()
      this.usuarioService.obterPorId(parseInt(localStorage.getItem('Identify'))).subscribe((resp: Usuario) => {
        this.usuario = resp
      })
      let postExcluir: string = localStorage.getItem('excluido');
      let postEditado: string = localStorage.getItem('editado');
      if (postExcluir == "true") {
        this.postStatus = true;
        this.alertMessage = "Postagem excluida com sucesso.";
        localStorage.removeItem('excluido');
        setTimeout(() => {
          location.assign('/feed');
        }, 3000);
      } else if (postEditado == "true") {
        this.postStatus = true;
        this.alertMessage = "Postagem editada com sucesso.";
        localStorage.removeItem('editado');
        setTimeout(() => {
          location.assign('/feed');
        }, 3000);
      }
    }
  }

  findAllPostagens() {
    this.postagemService.getAllPostagens().subscribe((resp: Postagem[]) => {
      this.listaPostagens = resp
    })
  }

  publicar() {
    this.postagem.usuario = this.usuario;
    this.postagemService.postPostagem(this.postagem).subscribe((resp: Postagem) => {
      this.postagem = resp
      location.assign('/feed')
    });
  }

  btnSim() {
    this.postagemService.deletePostagem(this.postagem.codigo).subscribe(() => {
      location.assign('/feed');
      localStorage.setItem('excluido', 'true')
    })
  }

}
