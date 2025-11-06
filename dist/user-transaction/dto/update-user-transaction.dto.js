"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserTransactionDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_user_transaction_dto_1 = require("./create-user-transaction.dto");
class UpdateUserTransactionDto extends (0, mapped_types_1.PartialType)(create_user_transaction_dto_1.CreateUserTransactionDto) {
}
exports.UpdateUserTransactionDto = UpdateUserTransactionDto;
//# sourceMappingURL=update-user-transaction.dto.js.map