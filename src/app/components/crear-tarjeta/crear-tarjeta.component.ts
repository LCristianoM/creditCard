import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TarjetaCredito } from '../../models/TarjetaCredito';
import { TarjetaService } from '../../services/tarjeta.service';

@Component({
  selector: 'app-crear-tarjeta',
  templateUrl: './crear-tarjeta.component.html',
  styleUrls: ['./crear-tarjeta.component.css'],
})
export class CrearTarjetaComponent implements OnInit {
  form: FormGroup;
  loading = false;
  titulo = 'Agregar Tarjeta';
  id: string | undefined;

  constructor(
    private fb: FormBuilder,
    private tarjetaSvc: TarjetaService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      titular: ['', Validators.required],
      numeroTarjeta: [
        '',
        [
          Validators.required,
          Validators.minLength(16),
          Validators.maxLength(16),
        ],
      ],
      fechaExpiracion: [
        '',
        [Validators.required, Validators.minLength(5), Validators.maxLength(5)],
      ],
      cvv: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(3)],
      ],
    });
  }

  ngOnInit(): void {
    this.tarjetaSvc.getTarjetaEdit().subscribe((data) => {
      console.log(data);
      this.id = data.id;
      this.titulo = 'Editar Tarjeta';
      this.form.patchValue({
        titular: data.titular,
        numeroTarjeta: data.numeroTarjeta,
        fechaExpiracion: data.fechaExpiracion,
        cvv: data.cvv,
      });
    });
  }

  guardarTarjeta() {
    if (this.id === undefined) {
      //se crea una nueva tarjeta
      this.agregarTarjeta();
    } else {
      //editamos la tarjeta
      this.editarTarjeta(this.id)

      }
    }

  editarTarjeta(id: string){
    const Tarjeta: any = {
      titular: this.form.value.titular,
      numeroTarjeta: this.form.value.numeroTarjeta,
      fechaExpiracion: this.form.value.fechaExpiracion,
      cvv: this.form.value.cvv,
      fechaActualiacion: new Date(),
    };
    this.loading = true;
    this.tarjetaSvc.editarTarjeta(id, Tarjeta).then(()=>{
      this.loading = false;
      this.titulo = 'Agregar Tarjeta';
      this.form.reset(),
      this.id = undefined;
      this.toastr.info('Se ha actualizado exitosamente su tarjeta', 'Registro actualizado')
    },error => {
      console.log(error)
    })
  }

  agregarTarjeta() {
    const Tarjeta: TarjetaCredito = {
      titular: this.form.value.titular,
      numeroTarjeta: this.form.value.numeroTarjeta,
      fechaExpiracion: this.form.value.fechaExpiracion,
      cvv: this.form.value.cvv,
      fechaCreacion: new Date(),
      fechaActualiacion: new Date(),
    };

    this.loading = true;
    this.tarjetaSvc.guardarTarjeta(Tarjeta).then(
      () => {
        this.loading = false;
        this.toastr.success('Tarjeta Registrada exitosamente', 'Información');
        this.form.reset();
      },
      (error) => {
        this.loading = false;
        this.toastr.error('Info', 'Error con las credenciales');
        console.log(error);
      }
    );
  }
}
