"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateReceiptDto = void 0;
const class_validator_1 = require("class-validator");
const receipt_entity_1 = require("../Entities/receipt.entity");
class CreateReceiptDto {
}
exports.CreateReceiptDto = CreateReceiptDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El monto es requerido' }),
    (0, class_validator_1.IsNumber)({}, { message: 'El monto debe ser un número' }),
    __metadata("design:type", Number)
], CreateReceiptDto.prototype, "monto", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El tipo de moneda es requerido' }),
    (0, class_validator_1.IsEnum)(receipt_entity_1.ReceiptCurrency, { message: 'El tipo de moneda debe ser pesos o dolares' }),
    __metadata("design:type", String)
], CreateReceiptDto.prototype, "tipo_moneda", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La descripción es requerida' }),
    (0, class_validator_1.IsString)({ message: 'La descripción debe ser una cadena de texto' }),
    __metadata("design:type", String)
], CreateReceiptDto.prototype, "descripcion", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La URL de la imagen es requerida' }),
    (0, class_validator_1.IsString)({ message: 'La URL de la imagen debe ser una cadena de texto' }),
    __metadata("design:type", String)
], CreateReceiptDto.prototype, "image_url", void 0);
//# sourceMappingURL=create-receipt.dto.js.map