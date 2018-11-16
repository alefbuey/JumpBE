--TRIGGERS
create or replace function create_Employer_Employee_Staff() returns trigger as
$$
begin
	insert into employers values(NEW.id,0.0,0.0,0,current_timestamp,current_timestamp);
	insert into employees values(NEW.id,0.0,0, current_timestamp,current_timestamp);
	raise notice 'It was inserted employeer, employee and staff';
	return NEW;
end;
$$ language plpgsql;

create trigger insert_Employer_Employee after insert on userjumps
for each row execute procedure create_Employer_Employee_Staff();	     
										     
CREATE OR REPLACE function updateNumJobsPosted() RETURNS trigger as
$$
declare 
idUser int;
numJobsPosted int;
begin
	idUser = NEW.idemployer;
	execute 'SELECT jobsPosted FROM employers where id = ' || idUser::text
    into numJobsPosted;
    
	execute 'UPDATE employers set jobsPosted = ' || (numJobsPosted+1)::text || ' WHERE id = ' || idUser::text;
	return NEW;
end;
$$ language plpgsql;
CREATE TRIGGER trig_updateNumJobsPosted AFTER INSERT ON jobs
for each row execute procedure updateNumJobsPosted();
										     
				
				
CREATE OR REPLACE function updateNumVacanciesWhenApply() RETURNS trigger as
$$
declare 
idJob int;
oldNumVacancies  int;
newNumVacancies int;
begin

	idjob = NEW.idjob;
	if NEW.state = 2 then
    	execute 'SELECT numbervacancies FROM jobs WHERE id = ' || idjob::text
        into oldNumVacancies;
        newNumVacancies := oldNumVacancies - 1;
    	execute 'UPDATE jobs SET numbervacancies = ' || newNumVacancies::text ||' WHERE id = ' || idJob::text ;
    end if;
	return NEW;
end;
$$ language plpgsql;
CREATE TRIGGER trig_updateNumVacanciesWhenApply AFTER UPDATE ON employeejobs
for each row execute procedure updateNumVacanciesWhenApply();


--INSERTS		
insert into userstates values
(default,'Active',current_timestamp,current_timestamp),
(default,'Inactive',current_timestamp,current_timestamp),
(default,'Banned',current_timestamp,current_timestamp);

insert into locations values
(default,'No Info','No Info',current_timestamp,current_timestamp),
(default,'Ecuador','Quito',current_timestamp,current_timestamp),
(default,'United States','New York',current_timestamp,current_timestamp),
(default,'Colombia','Bogota',current_timestamp,current_timestamp);

insert into NationalIdentifierTypes values
(default,'Identification Card',current_timestamp,current_timestamp),
(default,'Passport',current_timestamp,current_timestamp);

insert into UserJumps values
(default,2,1,1,'123456789','Fernanda','Zapata','ferchz123@gmail.com','1234','1996-04-25','Quicentro Sur','F','Ecuadorian',1000.00,4.5,'Computational Engineer','uploads/profiles/foto1.jpg'	,0978512456,current_timestamp,current_timestamp),
(default,3,2,1,'789465198','Camilo','Guitierrez','camilo566@gmail.com','1234','1998-04-25','Alameda','M','Ecuadorian',500.00,2.3,'Lawyer','uploads/profiles/foto2.jpg',0975123456,current_timestamp,current_timestamp),
(default,2,3,1,'516549716','Laura','Rivera','laur894@gmail.com','l894','1234-03-21','Amaguaña','F','Ecuadorian',20.00,3.5,'Mathematician','uploads/profiles/foto3.jpg',0978523456,current_timestamp,current_timestamp),
(default,2,1,2,'198952358','Enrique','Rivera','erivera879@gmail.com','1234','2000-05-17','Central Park','M','American',50.00,4.7,'Soccer Player','uploads/profiles/foto4.jpg',0978263456,current_timestamp,current_timestamp),
(default,3,1,1,'161698726','Jaime','Alban','jaimealba451@gmail.com','1234','1996-07-21','Iglesia de Veracruz','M','Colombian',700.00,4.0,'Lawyer','uploads/profiles/foto5.jpg',0978123456,current_timestamp,current_timestamp);

update Employees set ranking = 4.5, numbjobsdone = 8 where id = 1;
update Employees set ranking = 3.5, numbjobsdone = 9 where id = 2;
update Employees set ranking = 5.0, numbjobsdone = 15 where id = 3;
update Employees set ranking = 4.3, numbjobsdone = 8 where id = 4;
update Employees set ranking = 2.5, numbjobsdone = 2 where id = 5;

update Employers set ranking = 2.5, spentamount = 1500.00, jobsposted = 2 where id = 1;
update Employers set ranking = 4.5, spentamount = 2500.00, jobsposted = 3 where id = 2;
update Employers set ranking = 3.5, spentamount = 3000.00, jobsposted = 4 where id = 3;
update Employers set ranking = 2.3, spentamount = 500.00, jobsposted = 1 where id = 4;
update Employers set ranking = 4.5, spentamount = 10000.00, jobsposted = 8 where id = 5;

insert into jobstates values 
(default, 'Posted', current_timestamp,current_timestamp),
(default, 'InCourse', current_timestamp,current_timestamp),
(default, 'FinishedNoPay', current_timestamp,current_timestamp),
(default, 'Paid', current_timestamp,current_timestamp);


insert into jobmodes values
(default, 'Physical', current_timestamp,current_timestamp),
(default, 'Virtual', current_timestamp,current_timestamp);

insert into jobs values
(default, 1, 2,1,1,'Web Page Development','No description yet', 10000,5000, '2018-04-24','2018-04-30','2018-09-30','2018-04-29',1, 3,'uploads/jobs/job1.jpg'	, current_timestamp,current_timestamp),
(default, 2, 2,1,2,'Database design','No description yet', 100,50, '2018-03-24','2018-05-30','2018-06-30','2018-05-15',3, 3, 'uploads/jobs/job2.jpg', current_timestamp,current_timestamp),
(default, 3, 2,1,3,'Walking my dog','Just walk my dog!', 10,10, '2018-04-24','2018-04-26','2018-04-26','2018-04-25',1,2, 'uploads/jobs/job3.jpg',  current_timestamp,current_timestamp),
(default, 4, 2,1,1,'Web Page Development','Web Page of Sport Store', 10000,5000, '2018-10-24','2018-04-30','2018-09-30','2018-04-29',1,1, 'uploads/jobs/job1.jpg'	, current_timestamp,current_timestamp),
(default, 5, 2,1,2,'Database design','Database of a Enterprise', 100,50, '2018-09-24','2018-05-30','2018-06-30','2018-05-15',3,2, 'uploads/jobs/job2.jpg', current_timestamp,current_timestamp),
(default, 1, 2,1,3,'Walking my cat','Just walk my cat!', 10,10, '2018-11-10','2018-04-26','2018-04-26','2018-04-25',1,3, 'uploads/jobs/job3.jpg',  current_timestamp,current_timestamp);

insert into employeestates values 
(default, 'Applying', current_timestamp,current_timestamp),
(default, 'Working', current_timestamp,current_timestamp),
(default, 'Done', current_timestamp,current_timestamp);

insert into employeejobs values
(default,4,2,1,null,null,50,null,default,default,2,default,current_timestamp,current_timestamp),
(default,2,1,1,null,null,100,null,default,default,2,default,current_timestamp,current_timestamp),
(default,2,3,1,null,null,70,null,default,default,1,default,current_timestamp,current_timestamp),
(default,3,2,2,null,null,50,null,default,default,2,default,current_timestamp,current_timestamp),
(default,3,1,2,null,null,90,null,default,default,1,default,current_timestamp,current_timestamp),
(default,4,3,3,null,null,50,null,default,default,1,default,current_timestamp,current_timestamp);
 
insert into favoritejobs values
(1,1,current_timestamp,current_timestamp),
(1,2,current_timestamp,current_timestamp),
(1,3,current_timestamp,current_timestamp);

insert into categories values
(default,'Programming', 'Computer Skills',current_timestamp,current_timestamp),
(default,'Home','Home Tasks',current_timestamp,current_timestamp),
(default,'Teaching','Teaching Skills',current_timestamp,current_timestamp);

insert into tagjumps values
(default,'Web Programming', '', 1,current_timestamp,current_timestamp),
(default,'Haskell', '', 1,current_timestamp,current_timestamp),
(default,'Postgres', '', 1,current_timestamp,current_timestamp),
(default,'Plumbery', '', 2,current_timestamp,current_timestamp),
(default,'Carpentry', '', 2,current_timestamp,current_timestamp),
(default,'Clean house', '', 2,current_timestamp,current_timestamp),
(default,'Math tutoring', '', 3,current_timestamp,current_timestamp),
(default,'English tutoring', '', 3,current_timestamp,current_timestamp),
(default,'Programming teaching', '', 3,current_timestamp,current_timestamp);

insert into preferences values
(1,2,current_timestamp,current_timestamp),
(2,2,current_timestamp,current_timestamp),
(3,2,current_timestamp,current_timestamp),
(4,2,current_timestamp,current_timestamp);

				