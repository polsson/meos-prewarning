<?php

$q = "http://roc.olresultat.se/getpunches.asp?unitId=" . $_REQUEST["unitId"] . "&lastId=" . $_REQUEST["lastId"] . "&date=" . $_REQUEST["date"] . "&time=" . $_REQUEST["time"];

$incoming_data = file_get_contents($q);
$lines = preg_split("/\r\n|\n|\r/", $incoming_data);

$result = array();
foreach ($lines as $line)
{
    $csv = str_getcsv($line, ";");

    if(count($csv) != 4)
        continue;

    $result[] = array(
        "id" => $csv[0],
        "control" => $csv[1],
        "card" => $csv[2],
        "date" => substr($csv[3], 0, 10),
        "time" => substr($csv[3], 11) );
}

echo json_encode($result);
