// SPDX-License-Identifier: Waffle Team

pragma solidity ^0.8.0;

contract Licenses {
    // Predefined struct //
    struct Photo {
        string filePath;
        string metaPath;
        address owner;
        uint256 uploadedTime;
    }

    struct License {
        address owner;
        string originImageId;
        uint256 createdTime;
    }

    struct Host {
        address owner;
        string apiUrl;
        uint256 createdTime;
    }

    // Predefined states //
    string[] allPhotoIds;
    string[] allLicenseIds;
    uint256[] allHostIds;
    address payable beneficiary;
    uint256 licenseFee;

    // All images stored in system
    // Map image id to image info
    mapping(string => Photo) photos;

    // All licenses stored in system
    // Map license id to license info
    mapping(string => License) licenses;

    // Map image id to its license id
    // Default value: Empty string
    mapping(string => string) licenseIds;

    // A list of photo ids for each users
    // Default value: Empty list
    mapping(address => string[]) storages;

    // Map host id to host info
    mapping(uint256 => Host) hosts;

    // AI Execution results: execCode => result (str)
    mapping(uint256 => string) finalResults;

    // Constructor //
    constructor(uint256 _licenseFee) {
        beneficiary = payable(msg.sender);
        licenseFee = _licenseFee;
    }

    // Event
    event ExecutionFinised(uint256 execCode);

    // Functions //

    // Helper function
    function compareString(string memory str1, string memory str2)
        public
        pure
        returns (bool)
    {
        return
            keccak256(abi.encodePacked(str1)) ==
            keccak256(abi.encodePacked(str2));
    }

    function photoIdExist(string memory photoId) public view returns (bool) {
        string memory currentId;
        for (uint256 i = 0; i < allPhotoIds.length; i++) {
            currentId = allPhotoIds[i];
            if (compareString(currentId, photoId)) {
                return true;
            }
        }
        return false;
    }

    function licenseIdExist(string memory licenseId)
        public
        view
        returns (bool)
    {
        string memory currentId;
        for (uint256 i = 0; i < allLicenseIds.length; i++) {
            currentId = allLicenseIds[i];
            if (compareString(currentId, licenseId)) {
                return true;
            }
        }
        return false;
    }

    // Get functions
    function getTotalPhotos() public view returns (uint256) {
        return allPhotoIds.length;
    }

    function getAllPhotoIds() public view returns (string[] memory) {
        return allPhotoIds;
    }

    function getMyPhotoIds() public view returns (string[] memory) {
        return storages[msg.sender];
    }

    function getPhotoInfo(string memory photoId)
        public
        view
        returns (Photo memory)
    {
        return photos[photoId];
    }

    function getPhotoHash(string memory photoId)
        public
        view
        returns (string memory)
    {
        return getPhotoInfo(photoId).filePath;
    }

    function getMetaHash(string memory photoId)
        public
        view
        returns (string memory)
    {
        return getPhotoInfo(photoId).metaPath;
    }

    function getLicenseId(string memory photoId)
        public
        view
        returns (string memory)
    {
        return licenseIds[photoId];
    }

    function getLicenseInfo(string memory licenseId)
        public
        view
        returns (License memory)
    {
        return licenses[licenseId];
    }

    function getPhotoLicenseInfo(string memory photoId)
        public
        view
        returns (License memory)
    {
        return licenses[getLicenseId(photoId)];
    }

    function getTotalLicense() public view returns (uint256) {
        return allLicenseIds.length;
    }

    function getAllLicenseIds() public view returns (string[] memory) {
        return allLicenseIds;
    }

    function getAllLicensedPhotoIds() public view returns (string[] memory) {
        string[] memory ids = new string[](allLicenseIds.length);

        for (uint256 i = 0; i < allLicenseIds.length; i++) {
            ids[i] = licenses[allLicenseIds[i]].originImageId;
        }

        return ids;
    }

    function getLicenseFee() public view returns (uint256) {
        return licenseFee;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getMyBalance() public view returns (uint256) {
        return address(msg.sender).balance;
    }

    function getNumberOfHosts() public view returns (uint256) {
        return allHostIds.length;
    }

    function getAllHostUrls() public view returns (string[] memory) {
        string[] memory allHosts = new string[](allHostIds.length);
        for (uint256 i = 0; i < allHostIds.length; i++) {
            allHosts[i] = hosts[allHostIds[i]].apiUrl;
        }

        return allHosts;
    }

    function getAllHostIds() public view returns (uint256[] memory) {
        return allHostIds;
    }

    function getFinalResult(uint256 execCode)
        public
        view
        returns (string memory)
    {
        return finalResults[execCode];
    }

    function getPhotoIndex(string memory photoId, string[] memory photoIdList)
        public
        pure
        returns (uint256)
    {
        for (uint256 i = 0; i < photoIdList.length; i++) {
            if (compareString(photoId, photoIdList[i])) {
                return i;
            }
        }
        return 999;
    }

    // Withdraw from smart contract to beneficiary
    function withdraw() public {
        require(
            payable(msg.sender) == beneficiary,
            "You are not allowed to withdraw!"
        );
        require(address(this).balance > 0, "Smart contract balance is empty!");
        beneficiary.transfer(address(this).balance);
    }

    // Add function
    function addPhoto(
        string memory photoId,
        string memory filePath,
        string memory metaPath,
        address owner
    ) public {
        // string memory photoId = filePath; // use filepath (hash) as photo id
        require(!compareString(photoId, ""), "Photo ID can't be empty!");
        require(!compareString(filePath, ""), "File path can't be empty!");
        require(!compareString(metaPath, ""), "Meta path can't be empty!");
        require(!photoIdExist(photoId), "Photo ID already existed!");
        allPhotoIds.push(photoId);
        photos[photoId] = Photo(filePath, metaPath, owner, block.timestamp);
        storages[owner].push(photoId);
    }

    // Add license
    function addLicense(string memory photoId, string memory licenseId)
        public
        payable
    {
        // string memory licenseId = photoId; // use photoId for license Id
        require(!compareString(licenseId, ""), "License ID can't be empty!");
        require(!compareString(photoId, ""), "Photo ID can't be empty!");
        require(!licenseIdExist(licenseId), "License ID already existed!");
        require(msg.sender.balance >= msg.value, "Your balance is not enough!");
        require(msg.value == licenseFee, "Transfer value is incorrect!");

        // Add licenses
        allLicenseIds.push(licenseId);
        licenseIds[photoId] = licenseId;
        licenses[licenseId] = License(msg.sender, photoId, block.timestamp);
    }

    // Add reference
    function addReference(string memory photoId, string memory licenseId)
        public
    {
        require(!compareString(licenseId, ""), "License ID can't be empty!");
        require(!compareString(photoId, ""), "Photo ID can't be empty!");
        require(licenseIdExist(licenseId), "License ID not exist!");

        licenseIds[photoId] = licenseId;
    }

    // Add AI hosts
    function registerHost(string memory url) public {
        require(!compareString(url, ""), "Url can't be empty!");
        uint256 hostId = block.timestamp; // Use block timestamp for host id
        allHostIds.push(hostId);
        hosts[hostId] = Host(msg.sender, url, block.timestamp);
    }

    // Set new results
    function setResult(
        uint256 execCode,
        string memory photoId,
        string memory filePath,
        string memory metaPath,
        address owner,
        string memory result
    ) public {
        // Add result to exec code
        finalResults[execCode] = result;

        // Add photo to chain
        addPhoto(photoId, filePath, metaPath, owner);

        // Add reference in case duplicate
        // OK mean not duplicate
        // otherwise, return duplicated photo id
        if (!compareString(result, "OK")) {
            string memory licenseId = getLicenseId(result);
            licenseIds[photoId] = licenseId;
        }

        // Emit event
        emit ExecutionFinised(execCode);
    }

    // Remove function
    function removePhoto(string memory photoId) public {
        require(msg.sender == photos[photoId].owner, "Unauthorized!");
        require(
            !compareString(getPhotoLicenseInfo(photoId).originImageId, photoId),
            "Can't delete licensed photo!"
        );

        // delete license info (only reference)
        delete licenseIds[photoId];

        // delete photo info
        delete photos[photoId];

        // delete photo id in id list
        uint256 index = getPhotoIndex(photoId, allPhotoIds);
        if (index >= allPhotoIds.length) return;

        for (uint256 i = index; i < allPhotoIds.length - 1; i++) {
            allPhotoIds[i] = allPhotoIds[i + 1];
        }

        allPhotoIds.pop();

        // delete photo id in personal storage
        index = getPhotoIndex(photoId, storages[msg.sender]);
        if (index >= storages[msg.sender].length) return;

        for (uint256 i = index; i < storages[msg.sender].length - 1; i++) {
            storages[msg.sender][i] = storages[msg.sender][i + 1];
        }

        storages[msg.sender].pop();
    }
}

contract Executor {
    // Contract
    Licenses public licenses;

    // Struct
    struct Result {
        uint256 count;
        string[] allResults;
        mapping(string => uint256) resultCounts;
    }

    // Params
    uint256[] allExecCodes;
    mapping(uint256 => Result) results;

    // Constructor
    constructor(address licenseAdress) {
        licenses = Licenses(licenseAdress);
    }

    // Helper functions
    function halve(uint256 number) public pure returns (uint256) {
        if (number % 2 == 0) {
            return number / 2;
        } else {
            return number / 2 + 1;
        }
    }

    function resultExist(uint256 execCode, string memory result)
        public
        view
        returns (bool)
    {
        string memory currentResult;
        for (uint256 i = 0; i < results[execCode].allResults.length; i++) {
            currentResult = results[execCode].allResults[i];
            if (licenses.compareString(currentResult, result)) {
                return true;
            }
        }
        return false;
    }

    function execCodeExist(uint256 execCode) public view returns (bool) {
        uint256 currentCode;
        for (uint256 i = 0; i < allExecCodes.length; i++) {
            currentCode = allExecCodes[i];
            if (execCode == currentCode) {
                return true;
            }
        }
        return false;
    }

    function getExecCodeIndex(uint256 execCode) public view returns (uint256) {
        for (uint256 i = 0; i < allExecCodes.length; i++) {
            if (execCode == allExecCodes[i]) {
                return i;
            }
        }
        return 999;
    }

    // Getter function
    function getAllResults(uint256 execCode)
        public
        view
        returns (string[] memory)
    {
        return results[execCode].allResults;
    }

    function getTotalResults(uint256 execCode) public view returns (uint256) {
        return results[execCode].count;
    }

    function getResultCount(uint256 execCode, string memory result)
        public
        view
        returns (uint256)
    {
        return results[execCode].resultCounts[result];
    }

    function getBestResult(uint256 execCode)
        public
        view
        returns (string memory)
    {
        string memory bestResult = "NaN";
        uint256 bestCount = 0;
        string memory currentResult;
        uint256 currentCount;

        for (uint256 i = 0; i < results[execCode].allResults.length; i++) {
            currentResult = results[execCode].allResults[i];
            currentCount = results[execCode].resultCounts[currentResult];
            if (currentCount > bestCount) {
                bestCount = currentCount;
                bestResult = currentResult;
            }
        }

        return bestResult;
    }

    function getAllExecCodes() public view returns (uint256[] memory) {
        return allExecCodes;
    }

    function getNumberOfExecCodes() public view returns (uint256) {
        return allExecCodes.length;
    }

    function addResult(
        uint256 execCode,
        string memory photoId,
        string memory filePath,
        string memory metaPath,
        address owner,
        string memory result
    ) public {
        require(!licenses.compareString(result, ""), "Result can't be empty!");
        if (!execCodeExist(execCode)) {
            allExecCodes.push(execCode);
        }

        results[execCode].count += 1;

        if (!resultExist(execCode, result)) {
            results[execCode].allResults.push(result);
            results[execCode].resultCounts[result] = 1;
        } else {
            results[execCode].resultCounts[result] += 1;
        }

        // Enough responses
        uint256 nHosts = licenses.getNumberOfHosts();
        if (results[execCode].count >= nHosts) {
            string memory bestResult = getBestResult(execCode);
            licenses.setResult(
                execCode,
                photoId,
                filePath,
                metaPath,
                owner,
                bestResult
            );

            // Delete execCode
            removeExecCode(execCode);
        }
    }

    // Remove function
    function removeExecCode(uint256 execCode) internal {
        uint256 index = getExecCodeIndex(execCode);
        if (index >= allExecCodes.length) return;

        for (uint256 i = index; i < allExecCodes.length - 1; i++) {
            allExecCodes[i] = allExecCodes[i + 1];
        }

        allExecCodes.pop();

        delete results[execCode];
    }
}
