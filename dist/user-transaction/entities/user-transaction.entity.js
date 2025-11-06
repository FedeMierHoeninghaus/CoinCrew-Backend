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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTransactionEntity = exports.currency = exports.UserTransactionType = exports.UserTransaction = void 0;
class UserTransaction {
}
exports.UserTransaction = UserTransaction;
var UserTransactionType;
(function (UserTransactionType) {
    UserTransactionType["CONTRIBTION"] = "CONTRIBUTION";
    UserTransactionType["WITHDRAWAL"] = "WITHDRAWAL";
})(UserTransactionType || (exports.UserTransactionType = UserTransactionType = {}));
var currency;
(function (currency) {
    currency["UYU"] = "UYU";
    currency["USD"] = "USD";
})(currency || (exports.currency = currency = {}));
let UserTransactionEntity = class UserTransactionEntity {
};
exports.UserTransactionEntity = UserTransactionEntity;
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], UserTransactionEntity.prototype, "id", void 0);
__decorate([
    ManyToOne(() => User),
    JoinColumn({ name: 'user_id' }),
    __metadata("design:type", typeof (_a = typeof User !== "undefined" && User) === "function" ? _a : Object)
], UserTransactionEntity.prototype, "user", void 0);
__decorate([
    Column({ type: 'enum', enum: currency }),
    __metadata("design:type", String)
], UserTransactionEntity.prototype, "currency", void 0);
__decorate([
    Column({ type: 'enum', enum: UserTransactionType }),
    __metadata("design:type", String)
], UserTransactionEntity.prototype, "transaction_type", void 0);
__decorate([
    Column(type, 'numeric', precision, 18, scale, 2),
    __metadata("design:type", String)
], UserTransactionEntity.prototype, "amount", void 0);
__decorate([
    Column({ type: Date }),
    __metadata("design:type", String)
], UserTransactionEntity.prototype, "tx_date", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], UserTransactionEntity.prototype, "description", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], UserTransactionEntity.prototype, "created_at", void 0);
exports.UserTransactionEntity = UserTransactionEntity = __decorate([
    Entity('user_transaction')
], UserTransactionEntity);
//# sourceMappingURL=user-transaction.entity.js.map