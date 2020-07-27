import { Component, OnInit } from '@angular/core';
import { PostagemService } from '../services/postagem.service';
import { Postagem } from '../models/Postagem';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {

  postagem: Postagem = new Postagem

  constructor(private postagemService: PostagemService, private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    window.scroll(0, 0);

    if (localStorage.getItem('Token') == null) {
      this.router.navigate(["/notFound"])
    } else {
      let id = this.route.snapshot.params['id']
      this.findById(id);
    }
  }

  findById(id: number) {
    this.postagemService.getByIdPostagem(id).subscribe((resp: Postagem) => {
      this.postagem = resp;
    })
  }

  salvar() {
    this.postagemService.putPostagem(this.postagem).subscribe((resp: Postagem) => {
      this.postagem = resp
      localStorage.setItem('editado', "true");
      this.router.navigate(['/feed'])
    })
  }

  btnExcluir(postagem: Postagem) {
    this.postagem = postagem;
  }

  btnSim() {
    this.postagemService.deletePostagem(this.postagem.codigo).subscribe(() => {
      localStorage.setItem('excluido', 'true');
      this.router.navigate(['/feed'])
    })
  }

}
