DROP DATABASE IF EXISTS schild;
CREATE DATABASE schild;


CREATE TABLE Board (
    id int  NOT NULL,
    name text  NULL,
    CONSTRAINT Board_pk PRIMARY KEY (id)
);

CREATE TABLE Column (
    id int  NOT NULL,
    name text  NULL,
    position int  NULL,
    Board_id int  NOT NULL,
    CONSTRAINT Column_pk PRIMARY KEY (id)
);

CREATE TABLE Task (
    id int  NOT NULL,
    name text  NULL,
    description text  NULL,
    Column_id int  NOT NULL,
    CONSTRAINT Task_pk PRIMARY KEY (id)
);

ALTER TABLE Column ADD CONSTRAINT Column_Board
    FOREIGN KEY (Board_id)
    REFERENCES Board (id)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

ALTER TABLE Task ADD CONSTRAINT Task_Column
    FOREIGN KEY (Column_id)
    REFERENCES Column (id)
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;
