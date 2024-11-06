<?php
// CORS settings
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header("Content-Type: application/json; charset=UTF-8");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
//echo "API Here";
include 'db.php';
// Content of db.php
/*$host = 'localhost';
$dbname = 'concernahc_pharma';
$user = 'root';
$password = 'Manager';*/

try {
    $db = new PDO("mysql:host=$host;dbname=$dbname", $user, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit();
}

// Helper function to get POST data
function getPostData() {
    return json_decode(file_get_contents('php://input'), true);
}
// Route handling
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];
// Fetch staff list
if ($requestUri === '/api/staffs' && $requestMethod === 'GET') {
    $sql = 'SELECT * FROM staffs';
    try {
        $stmt = $db->query($sql);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($results);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database query failed']);
    }
}
// Fetch product list
elseif ($requestUri === '/api/products' && $requestMethod === 'GET') {
    $sql = 'SELECT * FROM products';
    try {
        $stmt = $db->query($sql);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($results);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database query failed']);
    }
}

elseif ($requestUri === '/api/clients' && $requestMethod === 'GET') {
    $sql = 'SELECT * FROM clients';
    try {
        $stmt = $db->query($sql);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($results);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database query failed']);
    }
}
// Fetch usertype based on usercode and validate password
elseif (strpos($requestUri, '/api/usertype/') === 0 && $requestMethod === 'GET') {
    // Extract usercode and password from the request URI
    $parts = explode('/', $requestUri);
    $usercode = isset($parts[3]) ? $parts[3] : null;
    $password = isset($parts[4]) ? $parts[4] : null;

    if (!$usercode || !$password) {
        http_response_code(400);
        echo json_encode(['error' => 'Usercode or password not provided']);
        exit();
    }

    // SQL query to fetch user information based on usercode
    $sql = 'SELECT username, usertype, staff_id, password FROM users WHERE usercode = ? and password = ?';

    try {
        $stmt = $db->prepare($sql);
        $stmt->execute([$usercode, $password]);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Check if the user exists
        if (count($results) === 0) {
            http_response_code(404);
            echo json_encode(['message' => 'User not found']);
        } else {
            $user = $results[0];

            // Validate password (assuming passwords are hashed in the database)
            
            // Return the usertype, staff_id, and username
            echo json_encode([
                'username' => $user['username'],
                'usertype' => $user['usertype'],
                'staff_id' => $user['staff_id']
            ]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database query failed: ' . $e->getMessage()]);
    }
}

//Doctors List
elseif ($requestUri === '/api/doctors' && $requestMethod === 'GET') {
    $sql = 'SELECT * FROM doctor';
    try {
        $stmt = $db->query($sql);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($results);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database query failed']);
    }
}
//Stock list
elseif ($requestUri === '/api/stocklist' && $requestMethod === 'GET') {
    $sql = 'SELECT * FROM stock';
    try {
        $stmt = $db->query($sql);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($results);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database query failed']);
    }
}
//fetch Usertypes from database
elseif ($requestUri === '/api/usertypes' && $requestMethod === 'GET') {
    $sql = 'SELECT DISTINCT usertype FROM users';
    try {
        $stmt = $db->query($sql);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($results);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database query failed']);
    }
}
//fetch clients from database
elseif ($requestUri === '/api/clients' && $requestMethod === 'GET') {
    $sql = 'SELECT * FROM client';
    try {
        $stmt = $db->query($sql);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($results);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database query failed']);
    }
}
// Add new staff
elseif ($requestUri === '/api/addstaffs' && $requestMethod === 'POST') {
    $staff = getPostData();
    $sql = 'INSERT INTO staffs (code, designation, fullname, mobile,reporting_to,reporting_id) VALUES (?, ?, ?, ?, ?, ?)';
    try {
        $stmt = $db->prepare($sql);
        $stmt->execute([$staff['code'], $staff['designation'], $staff['fullname'], $staff['mobile'],$staff['reporting_to'], $staff['reporting_id']]);
        http_response_code(201);
        echo json_encode(['message' => 'Staff added successfully', 'id' => $db->lastInsertId()]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database insert failed']);
    }
}
// Add new product
elseif ($requestUri === '/api/addproducts' && $requestMethod === 'POST') {
    $product = getPostData();
    $sql = 'INSERT INTO products (product_type, product_name, points, bonous, points_on_settlement, points_on_sample) VALUES (?, ?, ?, ?, ?, ?)';
    try {
        $stmt = $db->prepare($sql);
        $stmt->execute([$product['product_type'], $product['product_name'], $product['points'], $product['bonous'], $product['points_on_settlement'], $product['points_on_sample']]);
        http_response_code(201);
        echo json_encode(['message' => 'Product added successfully', 'id' => $db->lastInsertId()]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database insert failed']);
    }
}
//Add new client
elseif($requestUri==='/api/addclient' && $requestMethod === 'POST') {
    $client = getPostData();
    $sql = 'INSERT INTO clients (client_type, client_code, client_name, client_email, client_mobile, client_address, client_image)VALUES (?, ?, ?, ?, ?, ?, ?)';
    try{
        $stmt=$db->prepare($sql);
        $stmt->execute([$client['client_type'],$client['client_code'],$client['client_name'],$client['client_email'],$client['client_mobile'],$client['client_address'],$client['client_image'] ]);
        http_response_code(201);
        echo json_encode(['message' => 'client added successfully', 'id' => $db->lastInsertId()]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database insert failed']);
    }

}
//Outward_challan_head
elseif ($requestUri === '/api/outwardchallan' && $requestMethod === 'POST') {
    $outwardChallan = getPostData(); // Fetching POST data

    // Assuming 'outward_challan_head' has these fields: challan_no, challan_date, client_id, etc.
    $sql = 'INSERT INTO outward_challan_head (challan_date, issued_to, recieved_by,receiver_code, total_quantity) 
            VALUES (?, ?, ?, ?, ?)';
    
    try {
        $stmt = $db->prepare($sql);
        $stmt->execute([
            $outwardChallan['challan_date'],
            $outwardChallan['issued_to'],
            $outwardChallan['received_by'],
            $outwardChallan['receiver_code'],
            $outwardChallan['total_quantity']
        ]);
        http_response_code(201);
        echo json_encode(['message' => 'Outward challan added successfully', 'id' => $db->lastInsertId()]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database insert failed: ' . $e->getMessage()]);
    }
}

elseif ($requestUri === '/api/outwardchallan_details' && $requestMethod === 'POST') {
    $body = file_get_contents("php://input"); // Collect raw POST data
    $detailsData = json_decode($body, true); // Decode JSON data

    // Extract products array and stock_holder_id from the received data
    $products = $detailsData['products'];
    $stock_holder_id = $detailsData['stock_holder_id'];

    // Validate received data
    if (!isset($stock_holder_id) || !isset($products) || !is_array($products)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid data provided']);
        return;
    }

    // Prepare SQL statement for inserting product details
    $sqlInsertChallan = 'INSERT INTO outward_challan_details (product_id, product_name, product_type, quantity) VALUES (?, ?, ?, ?)';
    $sqlSelectStock = 'SELECT * FROM stock WHERE product_id = ? AND stock_holder_id = ?';
    $sqlUpdateStock = 'UPDATE stock SET stock_in_qty = stock_in_qty + ?, closing_stock = closing_stock + ? WHERE product_id = ? AND stock_holder_id = ?';
    $sqlInsertStock = 'INSERT INTO stock (product_type, product_name, product_id, stock_in_qty, closing_stock, stock_holder_id) VALUES (?, ?, ?, ?, ?, ?)';

    try {
        // Begin the transaction
        $db->beginTransaction();

        // Prepare statements
        $stmtInsertChallan = $db->prepare($sqlInsertChallan);
        $stmtSelectStock = $db->prepare($sqlSelectStock);
        $stmtUpdateStock = $db->prepare($sqlUpdateStock);
        $stmtInsertStock = $db->prepare($sqlInsertStock);

        // Loop through each product and handle insertion/updation
        foreach ($products as $product) {
            // Validate each product's data
            if (!isset($product['product_id'], $product['product_name'], $product['product_type'], $product['quantity'])) {
                throw new Exception('Invalid product data');
            }

            // Insert product into outward_challan_details
            $stmtInsertChallan->execute([
                $product['product_id'],
                $product['product_name'],
                $product['product_type'],
                $product['quantity']
            ]);

            // Check if the product exists in the stock for the stock_holder_id
            $stmtSelectStock->execute([$product['product_id'], $stock_holder_id]);
            $stockRecord = $stmtSelectStock->fetch(PDO::FETCH_ASSOC);

            if ($stockRecord) {
                // If stock exists, update the stock quantities
                $stmtUpdateStock->execute([
                    $product['quantity'],
                    $product['quantity'],
                    $product['product_id'],
                    $stock_holder_id
                ]);
            } else {
                // If stock does not exist, insert a new stock record
                $stmtInsertStock->execute([
                    $product['product_type'],
                    $product['product_name'],
                    $product['product_id'],
                    $product['quantity'],
                    $product['quantity'],
                    $stock_holder_id
                ]);
            }
        }

        // Commit the transaction after successful insertions and updates
        $db->commit();

        // Send a success response
        http_response_code(201);
        echo json_encode(['message' => 'Products inserted and stock updated successfully']);
    } catch (PDOException $e) {
        // Rollback transaction on error
        $db->rollBack();
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    } catch (Exception $e) {
        // Handle other types of errors
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
}



elseif ($requestUri === '/api/getoutwardhead' && $requestMethod === 'GET') {
    // Prepare the SQL query to fetch data from outward_challan_head
    $sql = 'SELECT * FROM outward_challan_head';
    
    try {
        // Execute the query
        $stmt = $db->prepare($sql);
        $stmt->execute();
        
        // Fetch all results as an associative array
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Return the results as a JSON response
        http_response_code(200);
        echo json_encode(['results' => $results]);
    } catch (PDOException $e) {
        // Handle database errors
        http_response_code(500);
        echo json_encode(['error' => 'Database query failed: ' . $e->getMessage()]);
    }
}

elseif ($requestUri === '/api/stock' && $requestMethod === 'POST') {
    $body = file_get_contents("php://input"); // Collect raw POST data
    $stockData = json_decode($body, true); // Decode JSON data

    // Extract product details
    /*$product_name = $stockData['product_name'] ?? null;
    $quantity = $stockData['quantity'] ?? null;
    $stock_point_holder = $stockData['stock_point_holder'] ?? null;
    $staff_code = $stockData['staff_code'] ?? null;*/

    // Validate the received data
    if (!$product_name || !$quantity || !$stock_point_holder || !$staff_code) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid data provided']);
        return;
    }

    // SQL to check if the product exists
    $selectSql = 'SELECT * FROM stock WHERE product_name = ? AND stock_holder_id = ?';

    try {
        // Prepare the select statement
        $stmt = $db->prepare($selectSql);
        $stmt->execute([$product_name, $stock_point_holder]);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (count($results) > 0) {
            // If the product exists, update the stock quantity
            $updateSql = 'UPDATE stock SET stock_in = stock_in + ? WHERE product_name = ? AND stock_holder_id = ?';
            $stmt = $db->prepare($updateSql);
            $stmt->execute([$quantity, $product_name, $stock_point_holder]);

            // Send success response
            http_response_code(200);
            echo json_encode(['message' => 'Stock updated successfully']);
        } else {
            // If the product does not exist, insert a new stock record
            $insertSql = 'INSERT INTO stock (product_name, opqty, stock_holder_id, stock_holder_code) VALUES (?, ?, ?, ?)';
            $stmt = $db->prepare($insertSql);
            $stmt->execute([$product_name, $quantity, $stock_point_holder, $staff_code]);

            // Send success response
            http_response_code(201);
            echo json_encode(['message' => 'Stock inserted successfully']);
        }
    } catch (PDOException $e) {
        // Handle database errors
        http_response_code(500);
        echo json_encode(['error' => 'Database operation failed: ' . $e->getMessage()]);
    }
}

//AddVisit head
elseif ($requestUri === '/api/addvisithead' && $requestMethod === 'POST') {
    // Collect the request body data
    $body = file_get_contents('php://input');
    $combinedData = json_decode($body, true);

    // Extract visitHead, couponCollectionList, and couponSettlementList
    $visitHeadPayload = $combinedData['visitHeadPayload'];
    $couponPayload = $combinedData['couponPayload'];
    $settlementPayload = $combinedData['settlementPayload'];
    $sampleGivenPayload = $combinedData['sampleGivenPayload'];
    $giftPayload = $combinedData['giftPayload'];

    // Prepare the SQL query to insert into visit_head table
    $visitHeadSql = "
        INSERT INTO visit_head (date, time, doctor_id, fullname, total_coupon_collected, total_coupon_points, total_coupon_bonus_points, total_settlement, total_settlement_points, total_sample_given, total_sample_points, total_gifts, staff_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ";

    try {
        // Insert visit head data
        $stmt = $db->prepare($visitHeadSql);
        $stmt->execute([
            $visitHeadPayload['date'],
            $visitHeadPayload['time'],
            $visitHeadPayload['visitedTo'],
            $visitHeadPayload['visitedToFullName'],
            $visitHeadPayload['totalQty'],
            $visitHeadPayload['totalPoints'],
            $visitHeadPayload['totalBonus'],
            $visitHeadPayload['totalSettlementQty'],
            $visitHeadPayload['totalSettlementPoints'],
            $visitHeadPayload['totalSampleQty'],
            $visitHeadPayload['totalSamplePoints'],
            $visitHeadPayload['totalGiftQty'],
            $visitHeadPayload['staff_id']
        ]);

        $visitId = $db->lastInsertId(); // Get the inserted visit head ID

        // Coupon ledger entry if totalQty > 0
        if ($visitHeadPayload['totalQty'] > 0) {
            $couponLedgerSQL = "
                INSERT INTO coupon_ledger (tdate, particulars, dr, staff_id, client_id, visit_id)
                VALUES (?, ?, ?, ?, ?, ?)
            ";
            $stmt = $db->prepare($couponLedgerSQL);
            $stmt->execute([
                $visitHeadPayload['date'],
                "Coupon Collected from " . $visitHeadPayload['visitedToFullName'],
                $visitHeadPayload['totalPoints'],
                $visitHeadPayload['staff_id'],
                $visitHeadPayload['visitedTo'],
                $visitId
            ]);
        }

        // Settlement ledger entry if totalSettlementQty > 0
        if ($visitHeadPayload['totalSettlementQty'] > 0) {
            $settlementLedgerSQL = "
                INSERT INTO coupon_ledger (tdate, particulars, cr, staff_id, client_id, visit_id)
                VALUES (?, ?, ?, ?, ?, ?)
            ";
            $stmt = $db->prepare($settlementLedgerSQL);
            $stmt->execute([
                $visitHeadPayload['date'],
                "Settled to " . $visitHeadPayload['visitedToFullName'],
                $visitHeadPayload['totalSettlementPoints'],
                $visitHeadPayload['staff_id'],
                $visitHeadPayload['visitedTo'],
                $visitId
            ]);
        }

        // Bonus ledger entry if totalBonus > 0
        if ($visitHeadPayload['totalBonus'] > 0) {
            $bonusLedgerSQL = "
                INSERT INTO bonus_ledger (tdate, particulars, cr, staff_id, client_id, visit_id)
                VALUES (?, ?, ?, ?, ?, ?)
            ";
            $stmt = $db->prepare($bonusLedgerSQL);
            $stmt->execute([
                $visitHeadPayload['date'],
                "Bonus Given to " . $visitHeadPayload['visitedToFullName'],
                $visitHeadPayload['totalBonus'],
                $visitHeadPayload['staff_id'],
                $visitHeadPayload['visitedTo'],
                $visitId
            ]);
        }

        // Stock update function for settlement, sample, and gift quantities
        $settlementQtyUpdate = "
            UPDATE stock SET stock_out_qty = stock_out_qty + ?, closing_stock = closing_stock - ? 
            WHERE product_id = ? AND stock_holder_id = ?
        ";

        function updateStockForSettlementQty($db, $products, $query, $staff_id) {
            foreach ($products as $product) {
                $stmt = $db->prepare($query);
                $stmt->execute([
                    $product['qty'],
                    $product['qty'],
                    $product['product_id'],
                    $staff_id
                ]);
            }
        }

        if ($visitHeadPayload['totalSettlementQty'] > 0) {
            updateStockForSettlementQty($db, $settlementPayload, $settlementQtyUpdate, $visitHeadPayload['staff_id']);
        }

        if ($visitHeadPayload['totalSampleQty'] > 0) {
            updateStockForSettlementQty($db, $sampleGivenPayload, $settlementQtyUpdate, $visitHeadPayload['staff_id']);
        }

        if ($visitHeadPayload['totalGiftQty'] > 0) {
            updateStockForSettlementQty($db, $giftPayload, $settlementQtyUpdate, $visitHeadPayload['staff_id']);
        }

        // Coupon and settlement insertions
        $couponCollectionSql = "
            INSERT INTO visit_details (visit_id, product_name, product_id, quantity, points, bonus, transaction_group)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ";

        // Helper function to insert coupon and settlement data
        function insertCoupons($db, $coupons, $visitId, $sqlQuery) {
            foreach ($coupons as $coupon) {
                $stmt = $db->prepare($sqlQuery);
                $stmt->execute([
                    $visitId,
                    $coupon['product_name'],
                    $coupon['product_id'],
                    $coupon['qty'],
                    $coupon['points'],
                    $coupon['bonus'],
                    $coupon['transaction_group']
                ]);
            }
        }

        insertCoupons($db, $couponPayload, $visitId, $couponCollectionSql);
        insertCoupons($db, $settlementPayload, $visitId, $couponCollectionSql);
        insertCoupons($db, $sampleGivenPayload, $visitId, $couponCollectionSql);
        insertCoupons($db, $giftPayload, $visitId, $couponCollectionSql);

        // All operations were successful
        http_response_code(201);
        echo json_encode(['message' => 'Visit and coupons added successfully', 'visitId' => $visitId]);

    } catch (PDOException $e) {
        // Handle database errors
        http_response_code(500);
        echo json_encode(['error' => 'Database insert failed: ' . $e->getMessage()]);
    }
}
//for visit list
elseif (strpos($requestUri,'/api/visithead')===0 && $requestMethod === 'GET') {
    $staffid = explode('/', $requestUri)[3];
    if (!$staffid) {
        http_response_code(400);
        echo json_encode(['error' => 'Username not provided']);
        exit();
    }
    $sql = 'SELECT * FROM visit_head where staff_id = ?';
    
    try {
        // Execute the query
        $stmt = $db->prepare($sql);
        $stmt->execute([$staffid]);
        
        // Fetch all results
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // If no results are found, return a 404 error
        if (empty($results)) {
            http_response_code(404);
            echo json_encode(['error' => 'No records found for the provided staff ID']);
            exit();
        }

        // Return the results as a JSON response
        echo json_encode($results);

    } catch (PDOException $e) {
        // Handle any database errors
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch coupon ledger data: ' . $e->getMessage()]);
    }
}
//Opening Stock Update
elseif ($requestUri === '/api/updateopstock' && $requestMethod === 'POST') {
    $stockData = getPostData(); // Collect raw POST data
    //$stockData = json_decode($body, true); // Decode JSON data
    if (!isset($stockData['product_id'], $stockData['stock_point_holder'],$stockData['quantity'],$stockData['staff_code'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid data provided']);
        return;
    }
    $product_id=$stockData['product_id'];
    $stock_point_holder=$stockData['stock_point_holder'];
    //echo $product_id;echo $stock_point_holder;
    try{
        $SearchStock='select * from stock where product_id=? and stock_holder_id=?';
        $stmt = $db->prepare($SearchStock);
        $stmt->execute([$product_id, $stock_point_holder]);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if(count($results)>0){
            $sqlupdate = 'update stock set opqty=?, closing_stock=(?+stock_in_qty)-stock_out_qty where product_id=? and stock_holder_id=?';
            $stmt = $db->prepare($sqlupdate);
            $stmt->execute([$stockData['quantity'],$stockData['quantity'],$product_id,$stock_point_holder]);
            http_response_code(201);
            echo json_encode(['message' => 'Stock updated successfully']);
        }else{
            $sqlInsertStock = 'INSERT INTO stock (product_id,product_name,opqty,closing_stock,stock_holder_id,stock_holder_code) VALUES (?, ?, ?, ?,?,?)';
            $stmt = $db->prepare($sqlInsertStock);
            $stmt->execute([$product_id,$stockData['product_name'],$stockData['quantity'],$stockData['quantity'],$stock_point_holder,$stockData['staff_code']]);
            http_response_code(201);
            echo json_encode(['message' => 'Stock inserted successfully']);
        }
                
    }catch(PDOException $ex){
        http_response_code(500);
        echo json_encode(['error' => 'Database insert failed: ' . $ex->getMessage()]);
    }
}
elseif (strpos($requestUri,'/api/getStaff/')===0 && $requestMethod==='GET'){
$userid = explode('/', $requestUri)[3];
    if (!$userid) {
        http_response_code(400);
        echo json_encode(['error' => 'Username not provided']);
        exit();
    }
    $sql = 'SELECT * FROM stock where stock_holder_id =?';
    $stmt=$db->prepare($sql);
    $stmt->execute([$userid]);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($results);
}
elseif ($requestUri === '/api/outwardchallanhead' && $requestMethod === 'GET') {
    // Prepare the SQL query to fetch data from outward_challan_head
    $sql = 'SELECT * FROM outward_challan_head';
    
    try {
        // Execute the query
        $stmt = $db->prepare($sql);
        $stmt->execute();
        
        // Fetch all results as an associative array
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Return the results as a JSON response
        http_response_code(200);
        echo json_encode($results);
    } catch (PDOException $e) {
        // Handle database errors
        http_response_code(500);
        echo json_encode(['error' => 'Database query failed: ' . $e->getMessage()]);
    }
}

//getBonusLedger
elseif (strpos($requestUri, '/api/getbonusledger/') === 0 && $requestMethod === 'GET') {
    // Extract the staff ID from the URL
    $staffId = explode('/', $requestUri)[3];

    // Validate staff ID
    if (!is_numeric($staffId)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid staff ID']);
        exit();
    }

    // Prepare the SQL query to fetch data from bonus_ledger for the given staff ID
    $sql = 'SELECT * FROM bonus_ledger WHERE client_id = ?';
    
    try {
        // Execute the query
        $stmt = $db->prepare($sql);
        $stmt->execute([$staffId]);
        
        // Fetch all results
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // If no results are found, return a 404 error
        if (empty($results)) {
            http_response_code(404);
            echo json_encode(['error' => 'No records found for the provided staff ID']);
            exit();
        }

        // Return the results as a JSON response
        echo json_encode($results);

    } catch (PDOException $e) {
        // Handle any database errors
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch bonus ledger data: ' . $e->getMessage()]);
    }
}

//getCouponLedger
elseif (strpos($requestUri, '/api/getcouponledger/') === 0 && $requestMethod === 'GET') {
    // Extract the staff ID from the URL
    $staffId = explode('/', $requestUri)[3];

    // Validate staff ID
    if (!is_numeric($staffId)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid staff ID']);
        exit();
    }

    // Prepare the SQL query to fetch data from coupon_ledger for the given staff ID
    $sql = 'SELECT * FROM coupon_ledger WHERE staff_id = ?';
    
    try {
        // Execute the query
        $stmt = $db->prepare($sql);
        $stmt->execute([$staffId]);
        
        // Fetch all results
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // If no results are found, return a 404 error
        if (empty($results)) {
            http_response_code(404);
            echo json_encode(['error' => 'No records found for the provided staff ID']);
            exit();
        }

        // Return the results as a JSON response
        echo json_encode($results);

    } catch (PDOException $e) {
        // Handle any database errors
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch coupon ledger data: ' . $e->getMessage()]);
    }
}
//for stock Report
elseif (strpos($requestUri, '/api/getstockreport') === 0 && $requestMethod === 'GET') {
    // Extract the staff ID from the URL
    $sql = 'SELECT * FROM stock';
    
    try {
        // Execute the query
        $stmt = $db->prepare($sql);
        $stmt->execute();
        
        // Fetch all results
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // If no results are found, return a 404 error
        if (empty($results)) {
            http_response_code(404);
            echo json_encode(['error' => 'No records found for the provided staff ID']);
            exit();
        }

        // Return the results as a JSON response
        echo json_encode($results);

    } catch (PDOException $e) {
        // Handle any database errors
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch coupon ledger data: ' . $e->getMessage()]);
    }
}
elseif (strpos($requestUri, '/api/getstockholderids') === 0 && $requestMethod === 'GET') {
    // Extract the staff ID from the URL
    $sql = 'SELECT id as stock_holder_id,fullname as stock_holder_name FROM staffs';
    
    try {
        // Execute the query
        $stmt = $db->prepare($sql);
        $stmt->execute();
        
        // Fetch all results
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // If no results are found, return a 404 error
        if (empty($results)) {
            http_response_code(404);
            echo json_encode(['error' => 'No records found for the provided staff ID']);
            exit();
        }

        // Return the results as a JSON response
        echo json_encode($results);

    } catch (PDOException $e) {
        // Handle any database errors
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch coupon ledger data: ' . $e->getMessage()]);
    }
}
elseif (strpos($requestUri, '/api/todayvisits') === 0 && $requestMethod === 'GET') {
    // Extract the staff ID from the URL
    $sql = 'SELECT visit_head.date as v_date,visit_head.time as v_time,visit_head.fullname as docname,staffs.fullname as sname,visit_head.total_coupon_points as tcpoints,visit_head.total_settlement_points as tsp,visit_head.total_coupon_bonus_points as tcbp FROM visit_head inner join staffs on visit_head.staff_id=staffs.id WHERE visit_head.date = CURDATE()';
    try {
        // Execute the query
        $stmt = $db->prepare($sql);
        $stmt->execute();
        
        // Fetch all results
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // If no results are found, return a 404 error
        if (empty($results)) {
            http_response_code(201);
            echo json_encode(['error' => 'No records found for the provided staff ID']);
            exit();
        }

        // Return the results as a JSON response
        echo json_encode($results);

    } catch (PDOException $e) {
        // Handle any database errors
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch coupon ledger data: ' . $e->getMessage()]);
    }
}
elseif (strpos($requestUri, '/api/getvisitbystaff') === 0 && $requestMethod === 'GET') {
    // Extract the staff ID from the URL
    $staffId = explode('/', $requestUri)[3];

    // Validate staff ID
    if (!is_numeric($staffId)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid staff ID']);
        exit();
    }
    $sql = 'SELECT visit_head.date as v_date,visit_head.time as v_time,visit_head.fullname as docname,staffs.fullname as sname,visit_head.total_coupon_points as tcpoints,visit_head.total_settlement_points as tsp,visit_head.total_coupon_bonus_points as tcbp FROM visit_head inner join staffs on visit_head.staff_id=staffs.id WHERE visit_head.staff_id =?';
    try {
        // Execute the query
        $stmt = $db->prepare($sql);
        $stmt->execute([$staffId]);
        
        // Fetch all results
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // If no results are found, return a 404 error
        if (empty($results)) {
            http_response_code(201);
            echo json_encode(['error' => 'No records found for the provided staff ID']);
            exit();
        }

        // Return the results as a JSON response
        echo json_encode($results);

    } catch (PDOException $e) {
        // Handle any database errors
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch visit data: ' . $e->getMessage()]);
    }
}
//Password Update
elseif (strpos($requestUri, '/api/update-password') === 0 && $requestMethod === 'GET') {
    // Extract the staff ID from the URL
    $updateinfo = getPostData();
    $staffId = $updateinfo['userId'];
    $oldPassword = $updateinfo['currentPassword'];
    $newPassword = $updateinfo['newPassword'];    
    $usertype=$updateinfo['userType'];
    $sql = 'SELECT * FROM users WHERE staff_id = ? and usertype =? and password =?';
    try{
        $stmt=$db->prepare($sql);
        $stmt->execute([$staffId,$usertype,$oldPassword]);
        $result=$stmt->fetchAll(PDO::FETCH_ASSOC);
        if(count($result)>0){
            $sql = 'UPDATE users SET password = ? WHERE staff_id = ? and usertype =?';
            $stmt=$db->prepare($sql);
            $stmt->execute([$newPassword,$staffId,$usertype]);
            http_response_code(201);
        }else{
            http_response_code(404);
            echo json_encode(['error' => 'Invalid Password']);
        }
    }catch(PDOException $ex){
        http_response_code(500);
        echo json_encode(['error' => 'Failed to Update Password: ' . $ex->getMessage()]);
    }    
}
//get coupon ledger closing balance
elseif (strpos($requestUri, '/api/couponbalance') === 0 && $requestMethod === 'GET') {
    // Extract the staff ID from the URL
    // Get the client ID from the request
    $clientId = explode('/', $requestUri)[3];    
    // Check if client ID is provided
    if (!$clientId) {
        echo json_encode(['error' => 'Client ID is required']);
        exit;
    }

    $sql = 'SELECT sum(dr) as tdr,sum(cr) as tcr FROM coupon_ledger WHERE client_id = ?';
    try{
        $stmt=$db->prepare($sql);
        $stmt->execute([$clientId]);
        $result=$stmt->fetchAll(PDO::FETCH_ASSOC);
        if(count($result)>0){
            $drtotal=$result[0]['tdr'];
            $crtotal=$result[0]['tcr'];
            $closingBalance=$drtotal-$crtotal;
            http_response_code(201);
            echo json_encode(['closing_balance' => $closingBalance]);            
        }
    }catch(PDOException $ex){
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch coupon ledger data: ' . $ex->getMessage()]);
    }   
}
elseif(strpos($requestUri,'/api/getvsoclients') === 0 && $requestMethod === 'GET'){
    $vsoid=explode('/',$requestUri)[3];
    $sql = 'SELECT distinct doctor_id as client_id,fullname as client_name FROM visit_head WHERE staff_id = ?';
    try{
        $stmt=$db->prepare($sql);
        $stmt->execute([$vsoid]);
        $result=$stmt->fetchAll(PDO::FETCH_ASSOC);
        if(count($result)>0){
            http_response_code(201);
            echo json_encode($result);
        }else{
            http_response_code(404);
            echo json_encode(['error' => 'No records found']);
        }
    }catch(PDOException $ex){
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch Client List: ' . $ex->getMessage()]);
    }

}
elseif (strpos($requestUri,'/api/clientvisit/')===0 && $requestMethod === 'GET') {
    $clientid = explode('/', $requestUri)[3];
    if (!$clientid) {
        http_response_code(400);
        echo json_encode(['error' => 'Username not provided']);
        exit();
    }
    $sql = 'SELECT * FROM visit_head where doctor_id = ?';
    
    try {
        // Execute the query
        $stmt = $db->prepare($sql);
        $stmt->execute([$clientid]);
        
        // Fetch all results
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // If no results are found, return a 404 error
        if (empty($results)) {
            http_response_code(404);
            echo json_encode(['error' => 'No records found for the provided staff ID'.$clientid]);
            exit();
        }

        // Return the results as a JSON response
        echo json_encode($results);

    } catch (PDOException $e) {
        // Handle any database errors
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch coupon ledger data: ' . $e->getMessage()]);
    }
}
elseif(strpos($requestUri,'/api/stafftypes') === 0 && $requestMethod === 'GET'){
    
    $sql = 'SELECT distinct designation FROM staffs';
    try{
        $stmt=$db->prepare($sql);
        $stmt->execute();
        $result=$stmt->fetchAll(PDO::FETCH_ASSOC);
        if(count($result)>0){
            http_response_code(201);
            echo json_encode($result);
        }else{
            http_response_code(404);
            echo json_encode(['error' => 'No records found']);
        }
    }catch(PDOException $ex){
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch Client List: ' . $ex->getMessage()]);
    }

}
elseif (strpos($requestUri,'/api/clientvisit_ad/')===0 && $requestMethod === 'GET') {
    $clientid = explode('/', $requestUri)[3];
    if (!is_numeric($clientid)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid staff ID']);
        exit();
    }
    $sql = 'SELECT visit_head.date as v_date,visit_head.time as v_time,visit_head.fullname as docname,staffs.fullname as sname,visit_head.total_coupon_points as tcpoints,visit_head.total_settlement_points as tsp,visit_head.total_coupon_bonus_points as tcbp FROM visit_head inner join staffs on visit_head.staff_id=staffs.id WHERE visit_head.doctor_id =?';
    try {
        // Execute the query
        $stmt = $db->prepare($sql);
        $stmt->execute([$clientid]);
        
        // Fetch all results
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // If no results are found, return a 404 error
        if (empty($results)) {
            http_response_code(201);
            echo json_encode(['error' => 'No records found for the provided staff ID']);
            exit();
        }

        // Return the results as a JSON response
        echo json_encode($results);

    } catch (PDOException $e) {
        // Handle any database errors
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch visit data: ' . $e->getMessage()]);
    }
}
// Handle unknown routes
elseif ($requestUri === '/api/updateproducts' && $requestMethod === 'POST') {
    header('Content-Type: application/json'); // Ensures JSON response
    $productData = getPostData();
    if (!isset($productData['id'], $productData['bonous'], $productData['points'], $productData['points_on_sample'], $productData['points_on_settlement'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid data provided']);
        return;
    }
    $product_id = $productData['id'];
    $points = $productData['points'];
    $bonus = $productData['bonous'];
    $ps = $productData['points_on_sample'];
    $ponsettlement = $productData['points_on_settlement'];
    $pname = $productData['product_name'];
    $ptype = $productData['product_type'];

    try {
        $updateproduct = 'UPDATE products SET product_type = ?, product_name = ?, points = ?, bonous = ?, points_on_settlement = ?, points_on_sample = ? WHERE id = ?';
        $stmt = $db->prepare($updateproduct);
        $stmt->execute([$ptype, $pname, $points, $bonus, $ponsettlement, $ps, $product_id]);                
        http_response_code(200);
        echo json_encode(['message' => 'Product updated successfully']);        
    } catch (PDOException $ex) {
        http_response_code(500);
        echo json_encode(['error' => 'Database Update failed: ' . $ex->getMessage()]);
    }
}

else {
    http_response_code(404);
    echo json_encode(['error' => 'Route Not Found','msg'=>$requestUri]);
}
?>
