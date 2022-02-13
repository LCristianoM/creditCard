import { Component, OnInit } from '@angular/core';
import { TarjetaService } from '../../services/tarjeta.service';
import { TarjetaCredito } from '../../models/TarjetaCredito';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listar-tarjeta',
  templateUrl: './listar-tarjeta.component.html',
  styleUrls: ['./listar-tarjeta.component.css'],
})
export class ListarTarjetaComponent implements OnInit {
  listTarjetas: TarjetaCredito[] = [];

  constructor(
    private tarjetaSvc: TarjetaService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.obtenerTarjetas();
  }

  obtenerTarjetas() {
    this.tarjetaSvc.obtenerTarjetas().subscribe((doc) => {
      this.listTarjetas = [];

      doc.forEach((element) => {
        this.listTarjetas.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });
      console.log(this.listTarjetas);
    });
  }
  eliminarTarjeta(id: any) {
    this.tarjetaSvc.eliminarTarjeta(id).then(
      () => {
        this.toastr.error(
          'La tarjeta se ha eliminado exitosamente',
          'Registro eliminado'
        );
      },
      (error) => {
        this.toastr.error('Ha ocurrido un error', 'Error');
        console.log(error);
      }
    );
  }

  editarTarjeta(tarjeta: TarjetaCredito){
    this.tarjetaSvc.addTarjetaEdit(tarjeta);
  }
}
