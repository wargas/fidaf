CREATE TABLE
  `codigos` (
    `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `codigo` varchar(255) DEFAULT NULL,
    `imposto` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`)
  );


CREATE TABLE
`ipca` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `mes` varchar(255) DEFAULT NULL,
  `indice` decimal(10, 2) DEFAULT NULL,
  PRIMARY KEY (`id`)
);


CREATE TABLE
`receitas` (
  `id` varchar(255) NOT NULL,
  `mes` varchar(255) DEFAULT NULL,
  `codigo` varchar(15) DEFAULT NULL,
  `descricao` text DEFAULT NULL,
  `recolhido` decimal(12, 2) DEFAULT NULL,
  `fonte` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
);


CREATE VIEW `correcao` AS
select
  `tb1`.`mes` AS `mes`,
  `tb1`.`maximo` / `tb1`.`indice` AS `correcao`
from
  (
    select
      `ipca`.`mes` AS `mes`,
      `ipca`.`indice` AS `indice`,
      (
        select
          max(`ipca`.`indice`)
        from
          `ipca`
      ) AS `maximo`
    from
      `ipca`
  ) `tb1`


  CREATE VIEW `resumo` AS
select
  `rc`.`mes` AS `mes`,
  `cd`.`imposto` AS `imposto`,
  sum(`rc`.`recolhido`) AS `nominal`,
  sum(`rc`.`recolhido`) * `cr`.`correcao` AS `corrigido`
from
  (
    (
      `receitas` `rc`
      left join `codigos` `cd` on (`cd`.`codigo` = `rc`.`codigo`)
    )
    left join `correcao` `cr` on (`cr`.`mes` = `rc`.`mes`)
  )
group by
  `rc`.`mes`,
  `cd`.`imposto`