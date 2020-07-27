import { Component, OnInit } from '@angular/core';
import { DoacaoService } from '../services/doacao.service';
import { Doacao } from '../models/doacao';
import { Usuario } from '../models/usuario';
import { UsuarioService } from '../services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Endereco } from '../models/endereco';
import { EnderecoService } from '../services/endereco.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-doacao',
  templateUrl: './doacao.component.html',
  styleUrls: ['./doacao.component.css']
})
export class DoacaoComponent implements OnInit {

  doacao: Doacao = new Doacao;
  usuario: Usuario = new Usuario;
  doacoes: Doacao[] = [];
  enderecos: Endereco[] = [];
  key: string = 'data';
  reverse: boolean = true;

  constructor(private doacaoService: DoacaoService, private usuarioService: UsuarioService, private enderecoService: EnderecoService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    window.scroll(0, 0);

    if (localStorage.getItem('Token') == null) {
      this.router.navigate(["/notFound"])
    } else {
      let idDoUsuario = this.route.snapshot.params['id'];
      this.obterUsuarioPorId(idDoUsuario);
      this.obterDoacoes(idDoUsuario);
      this.obterEnderecos();
    }
  }

  obterUsuarioPorId(id: number) {
    this.usuarioService.obterPorId(id).subscribe((resp: Usuario) => {
      this.usuario = resp
    })
  }

  obterDoacoes(idDoUsuario: number) {
    this.doacaoService.obterPorUsuario(idDoUsuario).subscribe((resp: Doacao[]) => {
      this.doacoes = resp;
    });
  }

  obterEnderecos() {
    this.enderecoService.obterTodos().subscribe((resp: Endereco[]) => {
      this.enderecos = resp;
    })
  }

  doar() {
    this.doacao.usuario = this.usuario;
    this.doacao.codigo = Math.random().toString(36).substr(2, 9) + Math.floor(Math.random() * 10);

    this.doacaoService.cadastrarDoacao(this.doacao)
      .subscribe((resp: Doacao) => {
        this.doacao = resp;

        Swal.fire({
          title: 'Agora falta pouco...',
          html: 'Apresente o código abaixo no local de doação escolhido!<br><br><b>' + this.doacao.codigo.toUpperCase() + '</b><br><br>Agradecemos desde já!',
          icon: 'success',
          confirmButtonColor: '#183059',
        }).then(() => {
          location.assign("/doacao/" + this.usuario.codigo)
        });
      })
  }
}
