const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports.create = function create(code, name, credit) {
    return prisma.module.create({
        data: {
            modCode: code,
            modName: name,
            creditUnit: Number(credit)
        }
    }).then(function (module) {
        return module;
    }).catch(function (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                // Prisma error codes: https://www.prisma.io/docs/orm/reference/error-reference#p2002
                throw new Error(`The module ${code} already exists`);
            }
        };
        throw error;
    });
};

module.exports.updateByCode = function updateByCode(code, credit) {
    return prisma.module.update({
        where: {
            modCode: code
        },
        data: {
            creditUnit: Number(credit)
        }
    }).then(function (module) {
        // Leave blank
    }).catch(function (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                // Prisma error codes: https://www.prisma.io/docs/orm/reference/error-reference#p2025
                throw new Error(`Module ${code} not found`);
            }
        };
        throw error;
    });
};

module.exports.deleteByCode = function deleteByCode(code) {
    return prisma.module.delete({
        where: {
            modCode: code
        }
    }).then(function (module) {
        // Leave blank
    }).catch(function (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                // Prisma error codes: https://www.prisma.io/docs/orm/reference/error-reference#p2025
                throw new Error(`Module ${code} not found`);
            }
        };
        throw error;
    });
};

module.exports.retrieveAll = function retrieveAll() {
    return prisma.module.findMany();
};

module.exports.retrieveByCode = function retrieveByCode(code) {
    return prisma.module.findUnique({
        where: {
            modCode: code
        }
    }).then(function (module) {
        if (!module) {
            throw new Error(`Module ${code} not found!`);
        }
        return module;
    }).catch(function (error) {
        throw error;
    });
};