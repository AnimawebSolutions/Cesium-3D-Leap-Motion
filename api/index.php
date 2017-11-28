<?php
    @session_start();

    require 'Slim/Slim.php';

    \Slim\Slim::registerAutoloader();

    $app = new \Slim\Slim();

    $app->contentType('text/html; charset=utf-8');

    define('BD_SERVIDOR', 'localhost');
    define('BD_USUARIO', 'root');
    define('BD_PASSWORD', '');
    define('BD_NOMBRE', 'mobile_congress');

    $db = new PDO('mysql:host=' . BD_SERVIDOR . ';dbname=' . BD_NOMBRE . ';charset=utf8', BD_USUARIO, BD_PASSWORD);

    $app->get('/', function() use($app) {
        $app->response->setStatus(200);
        echo "API REST para las geometrias";
    });


    // INSERTAR Geometrias
    $app->post('/insertGeometry', function () use($db, $app) {
        $cartodb_id = $app->request->post('cartodb_id');
        $polygon = $app->request->post('polygon');
        $alturas = $app->request->post('alturas');
        $province = $app->request->post('province');

        $consulta = $db->prepare("INSERT INTO plots (id_plot, polygon, height, id_province) VALUES (".$cartodb_id.", GeomFromText('POLYGON((".$polygon."))'),".$alturas.", ".$province.")");
        $estado = $consulta->execute();

        if($estado)
            echo 'Grabamos geometria con ID: '.$cartodb_id;
        else 
            echo 'Error al grabar la geometria con ID: '.$cartodb_id;
    });


    // OBTENER Geometrias
    // SELECT id_plot, AsText(polygon) as polygon, height FROM plots WHERE ST_Contains(GEOMFROMTEXT('POLYGON((-3.7179233446872573 40.39308644416934,-3.7179233446872573 40.42905930816934,-3.66846219889175 40.42905930816934,-3.66846219889175 40.39308644416934,-3.7179233446872573 40.39308644416934))', 0 ), polygon) AND id_province = 28;
    $app->get('/getGeometry/:southWest/:northWest/:northEast/:southEast/:provincia_id', function($southWest, $northWest, $northEast, $southEast, $provincia_id) use($app, $db) {
        try {
            $consulta = $db->prepare("SELECT id_plot, AsText(polygon) as polygon, height FROM plots WHERE ST_Contains(GEOMFROMTEXT('POLYGON((".$southWest.",".$northWest.",".$northEast.",".$southEast.",".$southWest."))', 0 ), polygon) AND id_province = ".$provincia_id);
            $consulta->execute();
            $resultados = $consulta->fetchAll(PDO::FETCH_OBJ);

            $geojson = array(
               'type'      => 'FeatureCollection',
               'features'  => array()
            );
            
            foreach($resultados as $resultado){
                $shape = substr($resultado->polygon, 9, strlen($resultado->polygon)-11);
                $shape = str_replace(",", "|", $shape);
                $shape = str_replace(" ", ",", $shape);
                $shapeArray = explode("|", $shape);

                $coordinates = array(
                    'type' => 'Polygon',
                    'coordinates' => array()
                );

                foreach ($shapeArray as $shape){
                    $integerIDs = json_decode('[' . $shape . ']', true);
                    array_push($coordinates['coordinates'], $integerIDs);
                }

                $feature = array(
                    'id' => $resultado->id_plot,
                    'type' => 'Feature', 
                    'geometry' => $coordinates,
                    'properties' => array(
                        'altura' => $resultado->height
                    )
                );
                array_push($geojson['features'], $feature);
            }

            header('Content-type: application/json');
            echo json_encode($geojson, JSON_NUMERIC_CHECK);
            $db = NULL;

        } catch(PDOException $e) {
            $app->response()->setStatus(404);
            echo '{"error":{"text":'. $e->getMessage() .'}}';
        }
    });


    // OBTENER Geometrias Eliminar
    // SELECT id_plot FROM plots WHERE NOT ST_Contains(GEOMFROMTEXT('POLYGON((-3.7179233446872573 40.39308644416934,-3.7179233446872573 40.42905930816934,-3.66846219889175 40.42905930816934,-3.66846219889175 40.39308644416934,-3.7179233446872573 40.39308644416934))', 0 ), polygon) AND id_province = 28;
    $app->get('/getGeometryDelete/:southWest/:northWest/:northEast/:southEast/:provincia_id', function($southWest, $northWest, $northEast, $southEast, $provincia_id) use($app, $db) {
        try {
            $consulta = $db->prepare("SELECT id_plot FROM plots WHERE NOT ST_Contains(GEOMFROMTEXT('POLYGON((".$southWest.",".$northWest.",".$northEast.",".$southEast.",".$southWest."))', 0 ), polygon) AND id_province = ".$provincia_id);
            $consulta->execute();
            $resultados = $consulta->fetchAll(PDO::FETCH_OBJ);

            $json = array(
               'deleteItems' => array()
            );
            
            foreach($resultados as $resultado){
                $idItem = array(
                     'id' => $resultado->id_plot
                );
                array_push($json['deleteItems'], $idItem);
            }

            header('Content-type: application/json');
            echo json_encode($json, JSON_NUMERIC_CHECK);
            $db = NULL;

        } catch(PDOException $e) {
            $app->response()->setStatus(404);
            echo '{"error":{"text":'. $e->getMessage() .'}}';
        }
    });


    // INSERTAR Antenas
    $app->post('/insertAntenna', function () use($db, $app) {
        $id_antenna = $app->request->post('id_antenna');
        $lat = $app->request->post('latitudeCenter');
        $lng = $app->request->post('longitudeCenter');
        $polygon = $app->request->post('polygon');
        $province = $app->request->post('province');

        $consulta = $db->prepare("INSERT INTO antennas (id_antenna, lat, lng, polygon, id_province) VALUES (".$id_antenna.", ".$lat.", ".$lng.", GeomFromText('POLYGON((".$polygon."))'), ".$province.")");
        $estado = $consulta->execute();

        if($estado)
            echo 'Grabamos antena con ID: '.$id_antenna;
        else 
            echo 'Error al grabar la antena con ID: '.$id_antenna;
    });
    

    // OBTENER Antenas
    // SELECT id_antenna, lat, lng FROM antennas WHERE ST_Contains(GEOMFROMTEXT('POLYGON((-3.711805606259022 40.44811690427574,-3.711805606259022 40.484089768275744,-3.663488941004491 40.484089768275744,-3.663488941004491 40.44811690427574,-3.711805606259022 40.44811690427574))', 0 ), polygon) AND id_province = 28;
    $app->get('/getAntennas/:southWest/:northWest/:northEast/:southEast/:provincia_id', function($southWest, $northWest, $northEast, $southEast, $provincia_id) use($app, $db) {
        try {
            $consulta = $db->prepare("SELECT id_antenna, lat, lng FROM antennas WHERE ST_Contains(GEOMFROMTEXT('POLYGON((".$southWest.",".$northWest.",".$northEast.",".$southEast.",".$southWest."))', 0 ), polygon) AND id_province = ".$provincia_id);
            $consulta->execute();
            $resultados = $consulta->fetchAll(PDO::FETCH_OBJ);

            $datajson = array();
            
            foreach($resultados as $resultado){
                $dataAntena = array(
                    'id' => $resultado->id_antenna,
                    'lat' => $resultado->lat,
                    'lng' => $resultado->lng
                );
                array_push($datajson, $dataAntena);
            }

            header('Content-type: application/json');
            echo json_encode($datajson, JSON_NUMERIC_CHECK);

            $db = NULL;

        } catch(PDOException $e) {
            $app->response()->setStatus(404);
            echo '{"error":{"text":'. $e->getMessage() .'}}';
        }
    });


    // OBETENER DATOS DE ANTENNAS
    // SELECT plt.id_plot, act.* FROM plots AS plt, activity AS act JOIN antennas AS ant ON (act.id_antenna = ant.id_antenna)  WHERE ST_Contains(Buffer(GEOMFROMTEXT(CONCAT('POINT(', ant.lng,' ',ant.lat, ')')), 0.01), plt.polygon) AND act.id_antenna = 2
    $app->get('/getGeometryAntennas/:antennaID', function($antennaID) use($app, $db) {
        try {
            $consulta = $db->prepare("SELECT plt.id_plot, act.* FROM plots AS plt, activity AS act JOIN antennas AS ant ON (act.id_antenna = ant.id_antenna)  WHERE ST_Contains(Buffer(GEOMFROMTEXT(CONCAT('POINT(', ant.lng,' ',ant.lat, ')')), 0.01), plt.polygon) AND act.id_antenna = ".$antennaID);
            $consulta->execute();
            $resultados = $consulta->fetchAll(PDO::FETCH_OBJ);

            $count = 1;
            $json = array(
               'dataAntenna' => array(
                    'actividadAntenna' => array(
                        array(
                        'label' => '00:00',
                        'value' => $resultados[0]->data_00
                    ),
                        array(
                        'label' => '01:00',
                        'value' => $resultados[0]->data_01
                    ),
                        array(
                        'label' => '02:00',
                        'value' => $resultados[0]->data_02
                    ),
                        array(
                        'label' => '03:00',
                        'value' => $resultados[0]->data_03
                    ),
                        array(
                        'label' => '04:00',
                        'value' => $resultados[0]->data_04
                    ),
                        array(
                        'label' => '05:00',
                        'value' => $resultados[0]->data_05
                    ),
                        array(
                        'label' => '06:00',
                        'value' => $resultados[0]->data_06
                    ),
                        array(
                        'label' => '07:00',
                        'value' => $resultados[0]->data_07
                    ),
                        array(
                        'label' => '08:00',
                        'value' => $resultados[0]->data_08
                    ),
                        array(
                        'label' => '09:00',
                        'value' => $resultados[0]->data_09
                    ),
                        array(
                        'label' => '10:00',
                        'value' => $resultados[0]->data_10
                    ),
                        array(
                        'label' => '11:00',
                        'value' => $resultados[0]->data_11
                    ),
                        array(
                        'label' => '12:00',
                        'value' => $resultados[0]->data_12
                    ),
                        array(
                        'label' => '13:00',
                        'value' => $resultados[0]->data_13
                    ),
                        array(
                        'label' => '14:00',
                        'value' => $resultados[0]->data_14
                    ),
                        array(
                        'label' => '15:00',
                        'value' => $resultados[0]->data_15
                    ),
                        array(
                        'label' => '16:00',
                        'value' => $resultados[0]->data_16
                    ),
                        array(
                        'label' => '17:00',
                        'value' => $resultados[0]->data_17
                    ),
                        array(
                        'label' => '18:00',
                        'value' => $resultados[0]->data_18
                    ),
                        array(
                        'label' => '19:00',
                        'value' => $resultados[0]->data_19
                    ),
                        array(
                        'label' => '20:00',
                        'value' => $resultados[0]->data_20
                    ),
                        array(
                        'label' => '21:00',
                        'value' => $resultados[0]->data_21
                    ),
                        array(
                        'label' => '22:00',
                        'value' => $resultados[0]->data_22
                    ),
                        array(
                        'label' => '23:00',
                        'value' => $resultados[0]->data_23
                    )),
                'radiusGeometry' => array()
                )
            );

            foreach($resultados as $resultado){
                array_push($json['dataAntenna']['radiusGeometry'], $resultado->id_plot);
            }

            header('Content-type: application/json');
            echo json_encode($json, JSON_NUMERIC_CHECK);
            $db = NULL;

        } catch(PDOException $e) {
            $app->response()->setStatus(404);
            echo '{"error":{"text":'. $e->getMessage() .'}}';
        }
    });

    $app->run();
?>