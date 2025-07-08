const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()


function getAllStaff() {
	return prisma.staff.findMany({		
	})
}

/** Section A: Basic Queries */


function getHodInfo() {
	return prisma.department.findMany({
		select: {
			deptName: true,
			hodApptDate: true
		}
	});
}


function getDeptStaffingInfo() {
	return prisma.department.findMany({
		select: {
			deptCode: true,
			noOfStaff: true
		},
		orderBy: [
			{noOfStaff: 'desc'}
		]
	});
}


function getCitizenshipWithoutDuplicates() {
	return prisma.staff.findMany({
		select: {
			citizenship: true
		},
		distinct: ['citizenship'],
		orderBy: [
			{citizenship: 'desc'}
		]
	});
}


/** Section B: Filtering Queries */


function getStaffofSpecificCitizenships() {
	return prisma.staff.findMany({
		select: {
			citizenship: true,
			staffName: true
		},
		where: {
			citizenship: { in: ['Hong Kong', 'Korea', 'Malaysia', 'Thailand'] }
		},
		orderBy: [
			{citizenship: 'asc'}
		]
	});
}


function getStaffWithBachelorDegreeOrDeputyDesignation() {
	return prisma.staff.findMany({
		select: {
			highestQln: true,
			staffName: true,
			designation: true
		},
		where: {
            OR: [
                {
                    highestQln: {startsWith: 'B'}
                },
                {
                    designation: {contains: 'Deputy'}
                }
            ]
        }
	});
}


function getStaffByCriteria1() {
	return prisma.staff.findMany({
		select: {
			gender: true,
			pay: true,
			maritalStatus: true,
			staffName: true
		},
		where: {
            AND: [
                {
                    maritalStatus: 'M' // Married staff
                },
                {
                    OR: [
                        {
                            AND: [
                                { gender: 'F' }, // Female staff
                                { 
                                    pay: {
                                        gte: 4000, // Greater than or equal to 4000
                                        lte: 7000  // Less than or equal to 7000
                                    }
                                }
                            ]
                        },
                        {
                            AND: [
                                { gender: 'M' }, // Male staff
                                {
                                    pay: {
                                        gte: 2000, // Greater than or equal to 2000
                                        lte: 6000  // Less than or equal to 6000
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        orderBy: [
            { gender: 'asc' },
            { pay: 'asc' }
        ]
	});
}


/** Section C: Relation Queries */

async function getDepartmentCourses() {
    return prisma.department.findMany({
		select: {
            deptName: true,
            course: {
                select: {
                    crseName: true,
                    crseFee: true,
                    labFee: true
                }
            }
        },
        orderBy: [
            { deptName: 'asc' }
        ]
    })
}


const getStaffAndDependents = () => {
    return prisma.staff.findMany({
		select: {
            staffName: true,
            staffDependent: {
                select: {
                    dependentName: true,
                    relationship: true
                }
            }
        },
        where: {
            staffDependent: {
                some: {} // Only include staff who have at least one dependent
            }
        }
    });
};

const getDepartmentCourseStudentDob = () => {
    return prisma.department.findMany({
		select: {
            deptName: true,
            course: {
                select: {
                    crseName: true,
                    student: {
                        select: {
                            studName: true,
                            dob: true
                        },
						orderBy: [{ dob: 'desc' }]
                    }
                },
                where: {
                    student: {
                        some: {} // Only courses with at least one student
                    }
                },
				orderBy: [{ crseName: 'asc' }]
            }
        },
        where: {
            course: {
                some: {} // Only departments with at least one course
            }
        },
        orderBy: [{ deptName: 'asc' }]
    });
};

async function main(argument) {
	let results;
	switch (argument) {
		case 'getAllStaff':
			results = await getAllStaff();
			break;
		case 'getCitizenshipWithoutDuplicates':
			results = await getCitizenshipWithoutDuplicates();
			break;
		case 'getHodInfo':
			results = await getHodInfo();
			break;
		case 'getDeptStaffingInfo':
			results = await getDeptStaffingInfo();
			break;
		case 'getStaffofSpecificCitizenships':
			results = await getStaffofSpecificCitizenships();
			break;
		case 'getStaffWithBachelorDegreeOrDeputyDesignation':
			results = await getStaffWithBachelorDegreeOrDeputyDesignation();
			break;
		case 'getStaffByCriteria1':
			results = await getStaffByCriteria1();
			break;
		case 'getDepartmentCourses':
			results = await getDepartmentCourses();
			break;
		case 'getStaffAndDependents':
			results = await getStaffAndDependents();
			break;
		case 'getDepartmentCourseStudentDob':
			results = await getDepartmentCourseStudentDob();
			break;
		default:
			console.log('Invalid argument');
			break;
	}
	//results && console.log(results);
	results && console.log(JSON.stringify(results, null, 2));
}

main(process.argv[2]);
